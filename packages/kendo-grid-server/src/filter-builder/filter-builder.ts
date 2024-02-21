import type { ObjectLiteral, SelectQueryBuilder, WhereExpressionBuilder } from 'typeorm';
import type { CompositeFilterDescriptor, FilterDescriptor } from '@progress/kendo-data-query';
import type { JoinAttribute } from 'typeorm/query-builder/JoinAttribute.js';

import { Brackets } from 'typeorm';
import { switchFn } from '../tool/switch-fn.js';

export class FilterBuilder {
    #i = 0;
    #composite: CompositeFilterDescriptor;
    #cteAlias?: string;

    constructor(composite: CompositeFilterDescriptor, cteAlias?: string) {
        this.#composite = composite;
        this.#cteAlias = cteAlias;
    }

    #resolveField(field: string, mainAlias: string, joins: JoinAttribute[]): string {
        if (this.#cteAlias) {
            return `${this.#cteAlias}.${field}`;
        } else if (field.includes('.')) {
            const [relationPath, fieldName] = field.split('.');
            const join = joins.find(j => j.relation?.propertyPath === relationPath);
            return join ? `${join.alias.name}.${fieldName}` : field; // Fallback to original field if join not found
        } else {
            return `${mainAlias}.${field}`;
        }
    }

    #buildCondition(operator: string, field: string, value: any, keySuffix: number): [string, any?] {
        const key = `${field}Key${keySuffix}`;
        return switchFn<string, [string, any?]>(
            operator as string,
            new Error(`Invalid operator "${operator}"`),
            [ 'isnull',             [ `${field} IS     NULL` ] ],
            [ 'isnotnull',          [ `${field} IS NOT NULL` ] ],
            [ 'isempty',            [ `${field}     LIKE ''` ] ],
            [ 'isnotempty',         [ `${field} NOT LIKE ''` ] ],
            [ 'eq',                 [ `${field} =  :${key}`, { [key]: value } ] ],
            [ 'neq',                [ `${field} != :${key}`, { [key]: value } ] ],
            [ 'lt',                 [ `${field} <  :${key}`, { [key]: value } ] ],
            [ 'lte',                [ `${field} <= :${key}`, { [key]: value } ] ],
            [ 'gt',                 [ `${field} >  :${key}`, { [key]: value } ] ],
            [ 'gte',                [ `${field} >= :${key}`, { [key]: value } ] ],
            [ 'contains',           [ `${field} LIKE :${key}`,      { [key]: `%${value ?? ''}%` } ] ],
            [ 'doesnotcontain',     [ `${field} NOT LIKE :${key}`,  { [key]: `%${value ?? ''}%` } ] ],
            [ 'startswith',         [ `${field}     LIKE :${key}`,  { [key]: `${value ?? ''}%` } ] ],
            [ 'doesnotstartwith',   [ `${field} NOT LIKE :${key}`,  { [key]: `${value ?? ''}%` } ] ],
            [ 'endswith',           [ `${field}     LIKE :${key}`,  { [key]: `%${value ?? ''}` } ] ],
        );
    }

    #recursiveTransform<T extends ObjectLiteral>(
        composite: CompositeFilterDescriptor,
        query: SelectQueryBuilder<T> | WhereExpressionBuilder,
        joins: JoinAttribute[]
    ): SelectQueryBuilder<T> | WhereExpressionBuilder {
        const { mainAlias } = (query as SelectQueryBuilder<any>).expressionMap;
        const whereFn = composite.logic === 'and' ? query.andWhere.bind(query) : query.orWhere.bind(query);

        composite.filters.forEach(filter => {
            if ((filter as CompositeFilterDescriptor).filters) {
                query = whereFn(new Brackets(qb => this.#recursiveTransform(filter as CompositeFilterDescriptor, qb, joins)));
            } else {
                const { operator, field, value } = filter as FilterDescriptor;
                if (typeof field === 'string' && typeof operator === 'string') {
                    const resolvedField = this.#resolveField(field, mainAlias?.name ?? '', joins);
                    const [condition, parameters] = this.#buildCondition(operator, resolvedField, value, ++this.#i);
                    query = whereFn(condition, parameters);

                }
            }
        });

        return query;
    }

    append<T extends ObjectLiteral>(query: SelectQueryBuilder<T>): SelectQueryBuilder<T> {
        this.#i = 0; // Reset counter
        const joins = query.expressionMap.joinAttributes;
        return this.#recursiveTransform(this.#composite, query, joins) as SelectQueryBuilder<T>;
    }
}