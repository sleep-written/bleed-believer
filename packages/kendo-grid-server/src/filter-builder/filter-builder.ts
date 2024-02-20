import type { ObjectLiteral, SelectQueryBuilder, WhereExpressionBuilder } from 'typeorm';
import type { JoinAttribute } from 'typeorm/query-builder/JoinAttribute.js';

import { Brackets } from 'typeorm';
import { switchFn } from '../tool/switch-fn.js';
import type { CompositeFilterDescriptor, FilterDescriptor } from '@progress/kendo-data-query';

export class FilterBuilder {
    #i = 0;
    #composite: CompositeFilterDescriptor;

    #cteAlias?: string;
    get cteAlias(): string | undefined {
        return this.#cteAlias;
    }

    /**
     * 
     * @param composite An object that implements `CompositeFilterDescriptor` interface.
     * @param isRaw If is `true`, the column's names in composite object will be used as it is.
     * Otherwise the column fields as be treated like an JSON path.
     */
    constructor(composite:CompositeFilterDescriptor, cteAlias?: string) {
        this.#composite = composite;
        this.#cteAlias = cteAlias;
    }

    #recursiveTransform<T extends ObjectLiteral>(
        composite: CompositeFilterDescriptor,
        query: SelectQueryBuilder<T> | WhereExpressionBuilder,
        joins: JoinAttribute[]
    ): SelectQueryBuilder<T> | WhereExpressionBuilder {
        for (const filter of composite.filters) {
            // Gets the filter type
            const { mainAlias } =  (query as SelectQueryBuilder<any>).expressionMap;
            const whereFn = composite.logic === 'and'
                ?   query.andWhere.bind(query)
                :   query.orWhere.bind(query);

            if ((filter as CompositeFilterDescriptor).filters instanceof Array) {
                // Nested composite
                const innerComposite = filter as CompositeFilterDescriptor;
                query = whereFn(new Brackets(qb => this.#recursiveTransform(innerComposite, qb, joins)));
            } else {
                // Leaf filter
                let { operator, field, value } = filter as FilterDescriptor;

                // Field validator
                if (typeof field !== 'string') {
                    throw new Error(`The field provided to apply a filter is invalid`);
                } else if (!field?.match(/(^[a-z0-9]+($|(\.[a-z0-9]+$)*)|^\[[^\[\]]+\]$)/gi)) {
                    throw new Error(`The field format provided to apply a filter is invalid`);
                } else if (this.#cteAlias == null) {
                    if (field.includes('.')) {
                        // Campo con prefijo, probablemente de un join
                        const parts = field.split('.');
                        const path = parts
                            .slice(0, -1)
                            .join('.');

                        const join = joins.find(x => x
                            .relation
                            ?.propertyPath === path
                        );

                        if (join) {
                            field = `${join.alias.name}.${parts.at(-1)}`;
                        }

                    } else if (typeof mainAlias?.name === 'string') {
                        // Campo sin prefijo, debe ser de la tabla base
                        field = `${mainAlias.name}.${field}`;
                    }
                } else {
                    field = `${this.#cteAlias}.${field}`;
                }

                if (
                    typeof field !== 'string' ||
                    !field?.match(/(^[a-z0-9]+($|(\.[a-z0-9]+$)*)|^\[[^\[\]]+\]$)/gi)
                ) {
                    throw new Error(`The field provided to apply filter is invalid`);
                }

                if (typeof operator === 'function') {
                    throw new Error('Custom function operators aren\'t supported');
                }

                // Build where condition
                const key = `${field}Key${++this.#i}`;
                const [ raw, data ] = switchFn<string, [ string, any? ]>(
                    operator as string,
                    new Error(`Invalid operator "${operator}"`),
                    [ 'isnull',         [ `${field} IS     NULL` ] ],
                    [ 'isnotnull',      [ `${field} IS NOT NULL` ] ],
                    [ 'isempty',        [ `${field}     LIKE ''` ] ],
                    [ 'isnotempty',     [ `${field} NOT LIKE ''` ] ],
                    [ 'eq',             [ `${field} =  :${key}`, { [key]: value } ] ],
                    [ 'neq',    [ `${field} != :${key}`, { [key]: value } ] ],
                    [
                        'lt',
                        [ `${field} <  :${key}`, { [key]: value } ]
                    ],
                    [
                        'lte',
                        [ `${field} <= :${key}`, { [key]: value } ]
                    ],
                    [
                        'gt',
                        [ `${field} >  :${key}`, { [key]: value } ]
                    ],
                    [
                        'gte',
                        [ `${field} >= :${key}`, { [key]: value } ]
                    ],
                    [
                        'contains', [
                            `${field} LIKE :${key}`,
                            { [key]: `%${value ?? ''}%` }
                        ]
                    ],
                    [
                        'doesnotcontain', [
                            `${field} NOT LIKE :${key}`,
                            { [key]: `%${value ?? ''}%` }
                        ]
                    ],
                    [
                        'startswith', [
                            `${field}     LIKE :${key}`,
                            { [key]: `${value ?? ''}%` }
                        ]
                    ],
                    [
                        'doesnotstartwith', [
                            `${field} NOT LIKE :${key}`,
                            { [key]: `${value ?? ''}%` }
                        ]
                    ],
                    [
                        'endswith', [
                            `${field}     LIKE :${key}`,
                            { [key]: `%${value ?? ''}` }
                        ]
                    ],
                );

                query = whereFn(raw, data);
            }
        }

        return query;
    }

    append<T extends ObjectLiteral>(query: SelectQueryBuilder<T>): SelectQueryBuilder<T> {
        this.#i = 0;
        const joins = query.expressionMap.joinAttributes;
        return this.#recursiveTransform(this.#composite, query, joins) as any;
    }
}