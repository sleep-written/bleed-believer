import type { EntityManager, ObjectLiteral, SelectQueryBuilder } from 'typeorm';
import type { GridDataResult } from './interfaces/grid-data-result.js';
import type { Request } from 'express';

import { odataQsParser } from './odata-qs-parser.js';
import { KendoFilter } from './kendo-filter.js';
import { KendoSort } from './kendo-sort.js';

export class KendoUITypeORM<T extends ObjectLiteral, CTE extends ObjectLiteral = {}> {
    #query: SelectQueryBuilder<T>;
    #manager: EntityManager;

    constructor(query: SelectQueryBuilder<T>, manager?: EntityManager) {
        this.#query = query;
        this.#manager = manager ?? this.#query.connection.manager;
    }

    async getRawMany(req: Request): Promise<GridDataResult<CTE>> {
        const { pagination, filter, sort } = odataQsParser(req);
        let qb = this.#query as SelectQueryBuilder<any>;

        // Create the common query for manipulation
        qb = this.#manager
            .createQueryBuilder()
            .select([ '*' ])
            .from(`(${qb.getQuery()})`, 'CTE')
            .setParameters(qb.getParameters());

        // Add the filter
        if (filter) {
            qb = new KendoFilter(filter, false).transform(qb);
        }

        // Count the total amount of rows found by the original query
        const { total } = await this.#manager
            .createQueryBuilder()
            .select([ 'COUNT(0) AS total' ])
            .from(`(${qb.getQuery()})`, 'CTE_COUNTER')
            .setParameters(qb.getParameters())
            .getRawOne<{ total: number; }>() ?? { total: 0 };

        // Adding pagination
        if (pagination) {
            qb = qb
                .limit(pagination.take)
                .offset(pagination.skip);
        }

        // Adding sort
        if (sort) {
            qb = new KendoSort(sort, false).transform(qb);
        } else {
            qb = qb.orderBy('1', 'ASC');
        }

        // Send response
        const data = await qb.getRawMany<CTE>();
        return { data, total };
    }

    async getMany(req: Request): Promise<GridDataResult<T>> {
        const { pagination, filter, sort } = odataQsParser(req);

        // Create the common query for manipulation
        let qb = this.#query

        // Add the filter
        if (filter) {
            qb = new KendoFilter<T>(filter, true).transform(qb);
        }

        // Adding sort
        if (sort) {
            qb = new KendoSort(sort, true).transform(qb);
        }

        // Adding pagination
        if (pagination) {
            qb = qb
                .take(pagination.take)
                .skip(pagination.skip);
        }

        // Send response
        const [ data, total ] = await qb.getManyAndCount();
        return { data, total };
    }
}