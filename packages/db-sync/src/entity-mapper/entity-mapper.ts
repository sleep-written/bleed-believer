import type { EntityManager, FindOptionsRelations, FindOptionsSelect, ObjectLiteral } from 'typeorm';
import type { RelationMetadata, EntityClass } from './interfaces/index.js';

export class EntityMapper<E extends ObjectLiteral> {
    #entity: EntityClass<E>;
    get entity(): EntityClass<E> {
        return this.#entity;
    }

    #select: FindOptionsSelect<E> = {};
    get select(): FindOptionsSelect<E> {
        return this.#select;
    }

    #pkKey!: keyof E;
    get pkKey(): keyof E {
        return this.#pkKey;
    }

    #relationsMetadata = new Map<string, RelationMetadata>();
    get relationsMetadata(): RelationMetadata[] {
        return Array.from(this.#relationsMetadata.values());
    }

    get relations(): FindOptionsRelations<E> {
        const o: any = {};
        for (const { propertyName } of this.#relationsMetadata.values()) {
            o[propertyName] = true;
        }
        return o;
    }

    constructor(manager: EntityManager, entity: EntityClass<E>) {
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

    getRelationMetadata(propertyName: string): RelationMetadata | undefined {
        return this.#relationsMetadata.get(propertyName);
    }

    filterRelationMetadata(
        predicate: (
            value: RelationMetadata,
            index: number
        ) => boolean
    ): RelationMetadata[] {
        return this.relationsMetadata.filter(predicate);
    }

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

    parse(text: string): E;
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
                if (input[propertyName][relatedPK] != null) {
                    const other = new relatedEntity();
                    other[relatedPK] = input[propertyName][relatedPK];
                    obj[propertyName] = other;
                }
            }

            return obj;
        }
    }
}