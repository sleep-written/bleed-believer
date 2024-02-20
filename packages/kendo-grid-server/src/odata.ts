import type { ObjectLiteral, SelectQueryBuilder } from 'typeorm';
import type { GridView, ExpressRequest } from './interfaces/index.js';
import type { ParsedQs } from './querystring-parser/index.js';

import { QuerystringParser } from './querystring-parser/querystring-parser.js';
import { FilterBuilder } from './filter-builder/index.js';

export class OData<T extends ObjectLiteral> {
    #query: SelectQueryBuilder<T>;
    #parsedQs: ParsedQs;

    constructor(
        query: SelectQueryBuilder<T>,
        request: ExpressRequest,
        filterColumnParsers?: Record<string, (v: any) => any>
    ) {
        this.#query = query;
        this.#parsedQs = new QuerystringParser(
            request.url,
            filterColumnParsers
        ).parse();
    }

    async getMany(): Promise<GridView<T>> {
        const { take, skip, sort, filter } = this.#parsedQs;
        let selectQuery = this.#query;

        sort?.forEach(({ field, dir }) => {
            selectQuery = selectQuery.addOrderBy(
                field,
                dir?.toUpperCase() as any
            );
        });

        if (filter) {
            selectQuery = new FilterBuilder(filter).append(selectQuery);
        }

        if (take) {
            selectQuery = selectQuery.take(take);
        }

        if (skip) {
            selectQuery = selectQuery.skip(skip);
        }

        const data = await selectQuery.getMany();
        const total = await selectQuery.getCount();
        return { data, total };
    }

    async getRawMany<O extends Record<string, any> = T>(): Promise<GridView<O>> {
        const { take, skip, sort, filter } = this.#parsedQs;
        const connection = this.#query.connection;

        let selectQuery = connection
            .createQueryBuilder()
            .from(`(${this.#query.getQuery()})`, 'CTE');

        if (filter) {
            selectQuery = new FilterBuilder(filter, 'CTE').append(selectQuery);
        }

        selectQuery = selectQuery
            .setParameters(this.#query.getParameters());

        const [ rawQuery, rawParam ] = selectQuery.getQueryAndParameters();
        const [{ total }] = await connection
            .createQueryRunner('slave')
            .query(
                `--sql
                ;WITH
                CTE2 AS (${rawQuery})

                SELECT
                    COUNT(*) AS total

                FROM CTE2`,
                rawParam
            ) as { total: number; }[];

        sort?.forEach(({ field, dir }) => {
            selectQuery = selectQuery.addOrderBy(
                `CTE.${field}`,
                dir?.toUpperCase() as any
            );
        });

        if (take) {
            selectQuery = selectQuery.limit(take);
        }

        if (skip) {
            selectQuery = selectQuery.offset(skip);
        }

        const data = await selectQuery.getRawMany();
        return { data, total };
    }
}