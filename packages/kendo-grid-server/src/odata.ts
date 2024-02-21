import type { ObjectLiteral, SelectQueryBuilder } from 'typeorm';
import type { GridView, ExpressRequest } from './interfaces/index.js';
import type { ParsedQs } from './querystring-parser/index.js';

import { QuerystringParser } from './querystring-parser/querystring-parser.js';
import { FilterBuilder } from './filter-builder/index.js';

/**
 * A class that serves as a bridge between the frontend requests and the TypeORM backend,
 * facilitating data querying, sorting, filtering, and pagination based on the parameters
 * received from an Express request. It leverages the QuerystringParser for parsing the
 * request URL into a structured format and uses FilterBuilder to apply filtering logic
 * directly on the SQL query built with TypeORM's SelectQueryBuilder.
 *
 * @typeParam T - The entity type that this OData instance will manage, extending TypeORM's
 * ObjectLiteral, which allows for any object shape that can be managed by TypeORM.
 */
export class OData<T extends ObjectLiteral> {
    #query: SelectQueryBuilder<T>;
    #parsedQs: ParsedQs;

    /**
     * Initializes a new instance of the OData class with a TypeORM query builder, the
     * Express request object, and an optional map of filter column parsers for custom
     * filter parsing logic.
     * 
     * @param query - The TypeORM SelectQueryBuilder instance used to build and execute
     * database queries for the specified entity.
     * @param request - The Express request object, containing the URL from which query
     * string parameters are parsed.
     * @param filterColumnParsers - An optional object mapping column names to custom
     * parsing functions, allowing for complex filter logic on specific columns.
     */
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

    /**
     * Retrieves many entities based on the parsed query string parameters, applying
     * sorting, filtering, pagination, and then executing the query to return a grid view
     * format that includes both the data and total count of records matching the query.
     * 
     * @returns A Promise resolving to a GridView object containing the queried data and
     * total record count.
     */
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

    /**
     * Retrieves many entities as raw data based on the parsed query string parameters.
     * This method is particularly useful for complex queries that involve operations
     * beyond simple CRUD, such as aggregations or transformations directly on the database.
     * It returns the data in a grid view format along with the total count of records.
     * 
     * @typeParam O - An optional generic parameter specifying the shape of the raw data
     * to be returned. Defaults to the entity type T if not specified.
     * @returns A Promise resolving to a GridView object containing the raw queried data and
     * total record count.
     */
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