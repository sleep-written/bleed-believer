import type { DataSource, FindManyOptions, ObjectLiteral, Repository, SelectQueryBuilder } from 'typeorm';
import type { CompositeFilterDescriptor, FilterDescriptor } from '@progress/kendo-data-query';
import type { GridView, ExpressRequest } from './interfaces/index.js';
import type { ParsedQs } from './querystring-parser/index.js';

import { And, Equal, IsNull, LessThan, LessThanOrEqual, Like, MoreThan, MoreThanOrEqual, Not, Or } from 'typeorm';
import { isCompositeFilterDescriptor } from '@progress/kendo-data-query';

import { QuerystringParser } from './querystring-parser/index.js';
import { ObjectMutator } from './tool/object-mutator.js';
import { switchFn } from './tool/switch-fn.js';

/**
 * A class designed to handle querying, filtering, and sorting of entities managed by TypeORM
 * based on the parameters received from an Express request. It utilizes QuerystringParser for 
 * parsing the request URL and applies complex filtering logic directly on the SQL query built 
 * with TypeORM's SelectQueryBuilder.
 * 
 * @typeParam T - The entity type that this ODataEntity instance will manage, extending TypeORM's
 * ObjectLiteral, which allows for any object shape that can be managed by TypeORM.
 */
export class ODataEntity<T extends ObjectLiteral> {
    #queryBuilder: SelectQueryBuilder<T>;
    #parsedQs: ParsedQs;

    /**
     * Initializes a new instance of the ODataEntity class with an entity constructor, 
     * a TypeORM DataSource, and the Express request object.
     * 
     * @param entity - The constructor of the entity that this instance will manage.
     * @param dataSource - The TypeORM DataSource instance used to retrieve the repository
     * of the specified entity.
     * @param request - The Express request object, containing the URL from which query
     * string parameters are parsed.
     */
    constructor(
        entity: { new(): T },
        dataSource: DataSource,
        request: ExpressRequest,
    ) {
        const repository: Repository<T> = dataSource.getRepository(entity);
        this.#queryBuilder = repository.createQueryBuilder();
        this.#parsedQs = new QuerystringParser(request.url).parse();
    }

    /**
     * Applies filtering logic to the query based on the parsed query string parameters.
     * This method is recursive and handles composite filters.
     * 
     * @param mutatorOptions - An instance of ObjectMutator that allows manipulation of
     * FindManyOptions.
     * @param composite - The composite filter descriptor containing the filter criteria.
     */
    #applyFilter(
        mutatorOptions: ObjectMutator<FindManyOptions<T>>,
        composite: CompositeFilterDescriptor
    ): void {
        composite.filters.forEach((x: any) => {
            if (isCompositeFilterDescriptor(x)) {
                this.#applyFilter(mutatorOptions, x);
            } else if (x) {
                const { field, value, operator } = x as FilterDescriptor;
                if (typeof field !== 'string') { return; }
                const currValue = switchFn(operator as string, undefined,
                    [ 'eq',             Equal(value)                  ],
                    [ 'neq',            Not(value)                    ],
                    [ 'isnull',         IsNull()                      ],
                    [ 'isnotnull',      Not(IsNull())                 ],
                    [ 'lt',             LessThan(value)               ],
                    [ 'lte',            LessThanOrEqual(value)        ],
                    [ 'gt',             MoreThan(value)               ],
                    [ 'gte',            MoreThanOrEqual(value)        ],
                    [ 'startswith',     Like(`${value ?? ''}%`)       ],
                    [ 'endswith',       Like(`%${value ?? ''}`)       ],
                    [ 'contains',       Like(`%${value ?? ''}%`)      ],
                    [ 'doesnotcontain', Not(Like(`%${value ?? ''}%`)) ],
                    [ 'isempty',        Equal('')                     ],
                    [ 'isnotempty',     Not(Equal(''))                ],
                );

                const whereField = `where.${field}`;
                if (currValue) {
                    const prevValue = mutatorOptions.get(whereField);
                    if (prevValue) {
                        const operatorFn = composite.logic === 'and' ? And : Or;
                        mutatorOptions.set(whereField, operatorFn(prevValue, currValue));

                    } else {
                        mutatorOptions.set(whereField, currValue);

                    }
                }
            }
        });
    }

    /**
     * Retrieves many entities based on the parsed query string parameters and the provided
     * find options. This method applies filtering, sorting, and pagination logic before
     * executing the query and returning the results along with the total count.
     * 
     * @param findOptions - The TypeORM FindManyOptions used to configure the query.
     * @returns A Promise resolving to a GridView object containing the queried data and
     * total record count.
     */
    async getMany(findOptions: FindManyOptions<T>): Promise<GridView<T>> {
        const { take, skip, sort, filter } = this.#parsedQs;
        const mutatorOptions = new ObjectMutator(findOptions);

        if (filter) {
            this.#applyFilter(mutatorOptions, filter);
        }

        sort?.forEach(({ field, dir }) => {
            if (typeof dir === 'string') {
                mutatorOptions.set(`order.${field}`, dir);
            }
        });

        let qb = this.#queryBuilder.setFindOptions(mutatorOptions.value);
        if (typeof take === 'number') {
            qb = qb.take(take);
        }

        if (typeof skip === 'number') {
            qb = qb.skip(skip);
        }

        const [ data, total ] = await qb.getManyAndCount();
        return { data, total };
    }
}