import type { CompositeFilterDescriptor, FilterDescriptor } from '@progress/kendo-data-query';
import type { ObjectLiteral, WhereExpressionBuilder } from 'typeorm';
import type { KendoTransformer } from './interfaces/kendo-transformer.js';

import { FilterOperator, normalizeFilters } from '@progress/kendo-data-query';
import { Brackets, SelectQueryBuilder } from 'typeorm';
import { switchFn } from './switch-fn.js';

export class KendoFilter<T extends ObjectLiteral> implements KendoTransformer<T> {
    #i = 0;
    #composite: CompositeFilterDescriptor;

    #appendMain: boolean;
    get appendMain(): boolean {
        return this.#appendMain;
    }

    constructor(composite:CompositeFilterDescriptor, appendMain?: boolean) {
        this.#composite = normalizeFilters(composite);
        this.#appendMain = !!appendMain;
    }

    #recursiveTransform(
        composite: CompositeFilterDescriptor,
        query: SelectQueryBuilder<T> | WhereExpressionBuilder,
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
                query = whereFn(new Brackets(qb => this.#recursiveTransform(innerComposite, qb)));
            } else {
                // Leaf filter
                let { operator, field, value } = filter as FilterDescriptor;

                // Field validator
                if (typeof field !== 'string') {
                    throw new Error(`The field provided to apply a filter is invalid`);
                } else if (!field?.match(/(^[a-z0-9]+($|(\.[a-z0-9]+$)*)|^\[[^\[\]]+\]$)/gi)) {
                    throw new Error(`The field format provided to apply a filter is invalid`);
                } else if (!field.includes('.') && typeof mainAlias?.name == 'string' && this.#appendMain) {
                    field = `${mainAlias.name}.${field}`;
                }

                if (
                    typeof field !== 'string' ||
                    !field?.match(/(^[a-z0-9]+($|(\.[a-z0-9]+$)*)|^\[[^\[\]]+\]$)/gi)
                ) {
                    throw new Error(`The field provided to apply filter is invalid`);
                } else if (!field.includes('.'))

                if (typeof operator === 'function') {
                    throw new Error('Custom function operators aren\'t supported');
                }

                // Build where condition
                const key = `${field}Key${++this.#i}`;
                const [ raw, data ] = switchFn<string, [ string, any? ]>(
                    operator as string,
                    new Error(`Invalid operator "${operator}"`),
                    [ FilterOperator.IsNull,        [ `${field} IS     NULL` ] ],
                    [ FilterOperator.IsNotNull,     [ `${field} IS NOT NULL` ] ],
                    [ FilterOperator.IsEmpty,       [ `${field}     LIKE ''` ] ],
                    [ FilterOperator.IsNotEmpty,    [ `${field} NOT LIKE ''` ] ],
                    [ FilterOperator.EqualTo,       [ `${field} =  :${key}`, { [key]: value } ] ],
                    [ FilterOperator.NotEqualTo,    [ `${field} != :${key}`, { [key]: value } ] ],
                    [
                        FilterOperator.LessThan,
                        [ `${field} <  :${key}`, { [key]: value } ]
                    ],
                    [
                        FilterOperator.LessThanOrEqual,
                        [ `${field} <= :${key}`, { [key]: value } ]
                    ],
                    [
                        FilterOperator.GreaterThan,
                        [ `${field} >  :${key}`, { [key]: value } ]
                    ],
                    [
                        FilterOperator.GreaterThanOrEqual,
                        [ `${field} >= :${key}`, { [key]: value } ]
                    ],
                    [
                        FilterOperator.Contains, [
                            `${field} LIKE :${key}`,
                            { [key]: `%${value ?? ''}%` }
                        ]
                    ],
                    [
                        FilterOperator.DoesNotContain, [
                            `${field} NOT LIKE :${key}`,
                            { [key]: `%${value ?? ''}%` }
                        ]
                    ],
                    [
                        FilterOperator.StartsWith, [
                            `${field}     LIKE :${key}`,
                            { [key]: `${value ?? ''}%` }
                        ]
                    ],
                    [
                        FilterOperator.DoesNotStartWith, [
                            `${field} NOT LIKE :${key}`,
                            { [key]: `${value ?? ''}%` }
                        ]
                    ],
                    [
                        FilterOperator.EndsWith, [
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

    transform(query: SelectQueryBuilder<T>): SelectQueryBuilder<T> {
        this.#i = 0;
        return this.#recursiveTransform(this.#composite, query) as any;
    }
}