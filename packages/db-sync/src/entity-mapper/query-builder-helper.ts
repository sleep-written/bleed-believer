import type { FindOperator, FindOptionsWhere, ObjectLiteral, SelectQueryBuilder, WhereExpressionBuilder } from 'typeorm';
import type { EntityMapper } from './entity-mapper.js';
import { flatten } from '@tool/obj-manipulator/index.js';

interface Join {
    type: 'inner' | 'left';
    property: string;
    alias: string;
    condition?: string;
    parameters?: Record<string, any>;
}

export class QueryBuilderHelper<E extends ObjectLiteral> {
    #whereIndex = 0;
    #mapper: EntityMapper<E>;
    #fields: string[] = [];
    #joins: Join[] = [];

    constructor(mapper: EntityMapper<E>) {
        this.#mapper = mapper;
    }

    #isFindOperator(o: any): boolean {
        if (o && o['@instanceof'] === Symbol.for('FindOperator')) {
            return true;
        } else {
            return false;
        }
    }

    #buildConditionAndParameters(
        path: string,
        value: any
    ): {
        condition: string;
        parameters?: Record<string, any>;
    } {
        if (this.#isFindOperator(value)) {
            const operator = value as FindOperator<any>;
            if (operator.getSql) {
                const condition = operator.getSql(path);
                const parameters = operator.objectLiteralParameters;
                return {
                    condition,
                    parameters
                };
            } else {
                throw new Error('`FindOperator.getSql` not found');
            }
        } else {
            const whereKey = `@raw_${this.#whereIndex++}`;
            return {
                condition: `${path} = :${whereKey}`,
                parameters: { [whereKey]: value }
            };
        }
    }

    #buildWhere<Q extends SelectQueryBuilder<E> | WhereExpressionBuilder>(
        query: Q,
        where: FindOptionsWhere<E>
    ): Q {
        const { entity } = this.#mapper;
        const flatWhere = flatten(where, o => !this.#isFindOperator(o));
        for (const { keys, value } of flatWhere) {
            if (keys.length === 0) {
                throw new Error('Invalid where expression');

            } else if (keys.length === 1) {
                // A property of the current entity
                const path = `${entity.name}.${keys.at(0)?.toString()}`;
                const { condition, parameters } = this.#buildConditionAndParameters(path, value);
                query = query.andWhere(condition, parameters) as Q;

            } else {
                // A property of nested entity
                keys.slice(0, -1).forEach((k, i , { length }) => {
                    // Create the property to declare the join
                    const property = i === 0
                        ?   `${entity.name}.${k.toString()}`
                        :   `${keys.at(i - 1)?.toString()}.${k.toString()}`;

                    // Search the current join
                    let join: Join | undefined = this.#joins.find(x =>
                        x.property === property &&
                        x.alias === k
                    );

                    if (!join) {
                        // Create the current join
                        join = {
                            type: 'inner',
                            property,
                            alias: k.toString()
                        };
                        this.#joins.push(join);
                    } else {
                        // Change the join type into INNER JOIN
                        join.type = 'inner';
                    }

                    if (i === length - 1) {
                        const path = `${k.toString()}.${keys.at(-1)?.toString()}`;
                        const { condition, parameters } =
                            this.#buildConditionAndParameters(
                                path,
                                value
                            );

                        join.condition = join.condition
                            ?   `${join.condition} AND (${join.condition})`
                            :   `(${condition})`;

                        join.parameters = join.parameters
                            ?   { ...join.parameters, ...parameters }
                            :   parameters;
                    }
                });
            }
        }

        return query;
    }

    #buildOrderBy(query: SelectQueryBuilder<E>): SelectQueryBuilder<E> {
        const { entity, pkKey } = this.#mapper;
        return query.orderBy(
            `${entity.name}.${pkKey.toString()}`,
            'ASC'
        );
    }

    #buildFields(query: SelectQueryBuilder<E>): SelectQueryBuilder<E> {
        const { select, entity } = this.#mapper;
        this.#fields = Object
            .entries(select)
            .filter(([ _, v ]) => typeof v === 'boolean')
            .map(([ k ]) => `${entity.name}.${k}`);

        return query.select(this.#fields);
    }

    #buildJoins(query: SelectQueryBuilder<E>): SelectQueryBuilder<E> {
        const { entity, relationsMetadata } = this.#mapper;
        relationsMetadata.forEach(({ propertyName, relatedPK }) => {
            const property = `${entity.name}.${propertyName}`;
            this.#fields.push(`${propertyName}.${relatedPK}`);

            if (
                !this.#joins.some(x =>
                    x.property === property &&
                    x.alias === propertyName
                )
            ) {
                this.#joins.push({
                    alias: propertyName,
                    type: 'left',
                    property,
                })
            }
        });

        for (const join of this.#joins) {
            const { type, property, alias, condition, parameters } = join;
            query = type === 'inner'
                ?   query.innerJoin(property, alias, condition, parameters)
                :   query. leftJoin(property, alias, condition, parameters);
        }

        return query;
    }

    public buildQuery(
        where?: FindOptionsWhere<E>
    ): SelectQueryBuilder<E> {
        this.#whereIndex = 0;
        this.#fields = [];
        this.#joins = [];

        const { manager, entity, pkKey } = this.#mapper;
        let query = manager.createQueryBuilder(entity, entity.name);


        if (where instanceof Array) {
            // query.andWhere(new Brackets(q => {
            //     for (const w of where) {
            //         q = this.#buildWhere(q, w);
            //     }

            //     return q;
            // }))
        } else if (where) {
            this.#buildWhere(query, where);
        }

        query = this.#buildOrderBy(query);
        query = this.#buildFields(query);
        query = this.#buildJoins(query);
        return query;
    }
}