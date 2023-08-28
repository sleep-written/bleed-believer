import type { EntityManager, ObjectLiteral, SelectQueryBuilder } from 'typeorm';
import type { GridDataResult } from './interfaces/grid-data-result.js';
import type { Request } from 'express';

import { odataQsParser } from './odata-qs-parser.js';
import { KendoFilter } from './kendo-filter.js';

export class KendoUITypeORM<T extends ObjectLiteral, CTE extends ObjectLiteral = {}> {
    #query: SelectQueryBuilder<T>;
    #manager: EntityManager;

    constructor(query: SelectQueryBuilder<T>, manager?: EntityManager) {
        this.#query = query;
        this.#manager = manager ?? this.#query.connection.manager;
    }

    async getRawMany(req: Request): Promise<GridDataResult<CTE>> {
        const { pagination, filter, sort } = odataQsParser(req);

        // Create the common query for manipulation
        let qb = this.#manager
            .createQueryBuilder()
            .select([ '*' ])
            .from(`(${this.#query.getQuery()})`, 'CTE');

        // Add the filter
        if (filter) {
            qb = new KendoFilter(filter, true).transform(qb);
        }

        // Count the total amount of rows found by the original query
        const { total } = await this.#manager
            .createQueryBuilder()
            .select([ 'COUNT(0) AS total' ])
            .from(`(${qb.getQuery()})`, 'CTE_EXT')
            .setParameters(qb.getParameters())
            .getRawOne<{ total: number; }>() ?? { total: 0 };

        // Adding pagination
        if (pagination) {
            qb = qb
                .limit(pagination.take)
                .offset(pagination.skip);
        }

        // Adding sort
        sort?.forEach(({ field, dir }, i) => {
            if (i === 0) {
                qb = qb.orderBy(field, dir?.toUpperCase() as any ?? 'ASC');
            } else {
                qb = qb.addOrderBy(field, dir?.toUpperCase() as any ?? 'ASC');
            }
        });

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
            qb = new KendoFilter<T>(filter, false).transform(qb);
        }

        // Adding pagination
        if (pagination) {
            qb = qb
                .take(pagination.take)
                .skip(pagination.skip);
        }

        // Adding sort
        sort?.forEach(({ field, dir }, i) => {
            if (i === 0) {
                qb = qb.orderBy(field, dir?.toUpperCase() as any ?? 'ASC');
            } else {
                qb = qb.addOrderBy(field, dir?.toUpperCase() as any ?? 'ASC');
            }
        });

        // Send response
        const [ data, total ] = await qb.getManyAndCount();
        return { data, total };
    }
}