import type { EntityManager, FindOptionsRelations, FindOptionsSelect, FindOptionsWhere, ObjectLiteral, SelectQueryBuilder } from 'typeorm';
import type { RelationMetadata, EntityClass } from './interfaces/index.js';
import { FindOperator } from 'typeorm';
import { flatten } from '@tool/obj-manipulator/flatten.js';

/**
 * Handles entity mapping operations, such as selection and serialization of entity data.
 */
export class EntityMapper<E extends ObjectLiteral> {
    #manager: EntityManager;
    get manager(): EntityManager {
        return this.#manager;
    }

    /**
     * The class type of the entity being handled.
     */
    #entity: EntityClass<E>;

    /**
     * Retrieves the entity class type.
     */
    get entity(): EntityClass<E> {
        return this.#entity;
    }

    /**
     * Specifies the properties of the entity to be selected during queries.
     */
    #select: FindOptionsSelect<E> = {};

    /**
     * Retrieves the selection properties.
     */
    get select(): FindOptionsSelect<E> {
        return this.#select;
    }

    /**
     * The primary key property name of the entity.
     */
    #pkKey!: keyof E;

    /**
     * Retrieves the primary key property name.
     */
    get pkKey(): keyof E {
        return this.#pkKey;
    }

    /**
     * Stores metadata for the entity's relations.
     */
    #relationsMetadata = new Map<string, RelationMetadata>();

    /**
     * Retrieves all relation metadata as an array.
     */
    get relationsMetadata(): RelationMetadata[] {
        return Array.from(this.#relationsMetadata.values());
    }

    /**
     * Constructs relationships for queries.
     */
    get relations(): FindOptionsRelations<E> {
        const o: any = {};
        for (const { propertyName } of this.#relationsMetadata.values()) {
            o[propertyName] = true;
        }
        return o;
    }

    /**
     * Initializes a new instance of `EntityMapper`.
     *
     * @param manager The TypeORM `EntityManager` to manage entity operations.
     * @param entity The class type of the entity to be mapped.
     */
    constructor(manager: EntityManager, entity: EntityClass<E>) {
        this.#manager = manager;
        this.#entity = entity;

        const metadata = manager
            .connection
            .getMetadata(entity);

        metadata
            .columns
            .forEach(x => {
                if (
                    x.relationMetadata &&
                    x.referencedColumn && (
                        x.relationMetadata?.isManyToOne ||
                        x.relationMetadata?.isOneToOne
                    )
                ) {
                    // El campo es una relación
                    this.#relationsMetadata.set(x.propertyName, {
                        propertyName: x.propertyName,
                        recursive: x.relationMetadata.type === entity,

                        relatedEntity: x.relationMetadata.type as any,
                        relatedPK: x.referencedColumn?.propertyName
                    });

                    // Agregar campo al select
                    if (x.referencedColumn) {
                        (this.#select as any)[x.propertyName] = {
                            [x.referencedColumn?.propertyName]: true
                        };
                    }
                } else if (!x.relationMetadata) {
                    if (x.isPrimary) {
                        // Capturar llave primaria
                        this.#pkKey = x.propertyName as keyof E;
                    }

                    // Agregar campo al select
                    (this.#select as any)[x.propertyName] = true;
                }
            });

        if (this.#pkKey == null) {
            throw new Error(`\`${entity.name}\` primary key not found.`);
        }
    }

    /**
     * Retrieves relation metadata based on the property name.
     *
     * @param propertyName The property name to search the metadata for.
     * @returns The relation metadata if found; otherwise, undefined.
     */
    getRelationMetadata(propertyName: string): RelationMetadata | undefined {
        return this.#relationsMetadata.get(propertyName);
    }

    /**
     * Filters relation metadata based on a predicate function.
     *
     * @param predicate A function to test each element.
     * @returns An array of relation metadata that matches the predicate.
     */
    filterRelationMetadata(
        predicate: (
            value: RelationMetadata,
            index: number
        ) => boolean
    ): RelationMetadata[] {
        return this.relationsMetadata.filter(predicate);
    }

    /**
     * Serializes the input entity data into a JSON string.
     *
     * @param input The entity data to serialize.
     * @param pretty Optionally format the JSON output. If `true`, uses
     * a default indentation of 4 spaces. If a number, uses that many spaces.
     * @returns A JSON string representation of the entity data.
     */
    stringify(input: E, pretty?: boolean | number): string {
        // Agregar los valores primitivos
        const obj = {} as any;
        Object
            .entries(this.#select)
            .filter(([ _, v ]) => typeof v === 'boolean' && v)
            .forEach(([ key ]) => {
                if (input[key] != null) {
                    obj[key] = input[key];
                }
            });

        // Agregar los ids de las relaciones
        for (const { propertyName, relatedPK } of this. relationsMetadata) {
            if (input[propertyName]?.[relatedPK] != null) {
                const other = {} as any;
                other[relatedPK] = input[propertyName][relatedPK];
                obj[propertyName] = other;
            }
        }

        // Implementar stringify al objeto normalizado
        if (pretty != null) {
            const tabsize = typeof pretty === 'number' ? pretty : 4;
            return JSON.stringify(obj, null, tabsize);
        } else {
            return JSON.stringify(obj);
        }
    }

    /**
     * Parses a JSON string into an entity instance.
     *
     * This overload takes a JSON string, which is first converted to a JSON object using
     * `JSON.parse`. The resulting object is then passed to the second overload of this method
     * to create and fill an entity instance based on the parsed data.
     *
     * @param text A JSON string that encodes the entity data. The string should represent a
     * serialized form of the entity, including any related entity information as nested JSON
     * objects where primary keys are provided.
     * @returns An instance of the entity, with fields populated according to the JSON data.
     */
    parse(text: string): E;
    /**
     * Parses a JSON object into an entity instance.
     * 
     * This overload takes a `Record<string, any>` object representing the entity data.
     * It creates a new instance of the entity and fills it with the provided data,
     * including resolving and attaching related entities based on their primary keys.
     *
     * @param data A `Record<string, any>` object containing key-value pairs that represent
     * the fields of the entity. Fields corresponding to relations should provide an object
     * with a primary key.
     * @returns An instance of the entity filled with the parsed data.
     */
    parse(data: Record<string, any>): E;
    parse(input: string | Record<string, any>): E {
        if (typeof input === 'string') {
            const json = JSON.parse(input);
            return this.parse(json);

        } else {
            // Agregar los valores primitivos
            const obj = new this.#entity() as any;
            Object
                .entries(this.#select)
                .filter(([ _, v ]) => typeof v === 'boolean' && v)
                .forEach(([ key ]) => {
                    if (input[key] != null) {
                        obj[key] = input[key];
                    }
                });

            // Agregar los ids de las relaciones
            for (const { propertyName, relatedEntity, relatedPK } of this.relationsMetadata) {
                if (input[propertyName]?.[relatedPK] != null) {
                    const other = new relatedEntity();
                    other[relatedPK] = input[propertyName][relatedPK];
                    obj[propertyName] = other;
                }
            }

            return obj;
        }
    }

    getQuery(where?: FindOptionsWhere<E>): SelectQueryBuilder<E> {
        let query = this.#manager.createQueryBuilder(
            this.#entity,
            this.#entity.name
        );

        const select = Object
            .entries(this.#select)
            .filter(([ _, v ]) => typeof v === 'boolean')
            .map(([ k ]) => `${this.#entity.name}.${k}`);

        const joins: [
            type: 'inner' | 'left',
            joinProp: string,
            alias: string,
            condition?: string,
            parameters?: Record<string, any>
        ][] = [];

        if (where) {
            const isFindOperator = (o: any) => {
                if (o && o['@instanceof'] === Symbol.for(FindOperator.name)) {
                    return true;
                } else {
                    return false;
                }
            };

            let i = 0;
            const flatWhere = flatten(where, o => !isFindOperator(o));
            for (const { keys, value } of flatWhere) {
                if (keys.length === 0) {
                    throw new Error('Invalid where expression');
                } else if (keys.length === 1) {
                    const aliasPath = `${this.#entity.name}.${keys.at(0)?.toString()}`;
                    if (isFindOperator(value)) {
                        const operator = value as FindOperator<any>;
                        if (operator.getSql) {
                            const generator = operator.getSql(aliasPath);
                            query = query.andWhere(
                                generator,
                                operator.objectLiteralParameters
                            );
                        }
                    } else {
                        const whereKey = `@raw${i++}`;
                        query = query.andWhere(
                            `${aliasPath} = :${whereKey}`,
                            { [whereKey]: value }
                        );
                    }
                } else {
                    keys
                        .slice(0, -1)
                        .forEach((k, i, { length }) => {
                            const joinProp = i === 0
                                ?    `${this.#entity.name}.${k.toString()}`
                                :    `${keys.at(i - 1)?.toString()}.${k.toString()}`;

                            const join = joins.find(x => x[1] === joinProp && x[2] === k);
                            if (join) {
                                join[0] = 'inner';
                                if (i === length - 1) {
                                    const aliasPath = `${k.toString()}.${keys.at(-1)?.toString()}`;
                                    if (isFindOperator(value)) {
                                        const operator = value as FindOperator<any>;
                                        if (operator.getSql) {
                                            const generator = operator.getSql(aliasPath);

                                            if (join[3] != null) {
                                                join[3] = `${join[3]} AND (${generator})`;
                                            } else {
                                                join[3] = `(${generator})`;
                                            }
        
                                            if (operator.objectLiteralParameters) {
                                                if (!join[4]) {
                                                    join[4] = operator.objectLiteralParameters;
                                                } else {
                                                    join[4] = {
                                                        ...join[4],
                                                        ...operator.objectLiteralParameters
                                                    };
                                                }
                                            }
                                        }
                                    } else {
                                        const whereKey = `@raw${i++}`;
                                        if (join[3]) {
                                            join[3] = `${join[3]} AND (${aliasPath} = :${whereKey})`
                                        }
                                        
                                        join[4] = {
                                            ...(join[4] ?? {}),
                                            [whereKey]: value
                                        };
                                    }
                                }
                            } else {
                                if (i === length - 1) {
                                    const aliasPath = `${k.toString()}.${keys.at(-1)?.toString()}`;
                                    if (isFindOperator(value)) {
                                        const operator = value as FindOperator<any>;
                                        if (operator.getSql) {
                                            const generator = operator.getSql(aliasPath);
                                            joins.push([
                                                'inner',
                                                joinProp,
                                                k.toString(),
                                                `(${generator})`,
                                                operator.objectLiteralParameters
                                            ]);
                                        }
                                    } else {
                                        const whereKey = `@raw${i++}`;
                                        joins.push([
                                            'inner',
                                            joinProp,
                                            k.toString(),
                                            `(${aliasPath}) = :${whereKey}`,
                                            { [whereKey]: value }
                                        ]);
                                    }
                                } else {
                                    joins.push([
                                        'inner',
                                        joinProp,
                                        k.toString()
                                    ]);
                                }
                            }
                        });
                }
            }
        }

        this.#relationsMetadata.forEach(({ propertyName, relatedPK }) => {
            const joinProp = `${this.#entity.name}.${propertyName}`;
            select.push(`${propertyName}.${relatedPK}`);

            if (!joins.some(x => x[1] === joinProp && x[2] === propertyName)) {
                joins.push([ 'left', joinProp, propertyName ]);
            }
        });

        for (const [ type, joinProp, alias, condition, parameters ] of joins) {
            query = type === 'inner'
                ?   query.innerJoin(joinProp, alias, condition, parameters)
                :   query. leftJoin(joinProp, alias, condition, parameters);
        }

        return query
            .select(select)
            .orderBy(
                `${this.#entity.name}.${this.#pkKey.toString()}`,
                'ASC'
            );
    }
}