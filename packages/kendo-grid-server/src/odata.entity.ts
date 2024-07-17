import type { DataSource, FindManyOptions, ObjectLiteral, Repository, SelectQueryBuilder } from 'typeorm';
import type { GridView, ExpressRequest } from './interfaces/index.js';
import type { ParsedQs } from './querystring-parser/index.js';

import { QuerystringParser } from './querystring-parser/index.js';

export class ODataEntity<T extends ObjectLiteral> {
    #queryBuilder: SelectQueryBuilder<T>;
    #parsedQs: ParsedQs;

    constructor(
        entity: { new(): T },
        dataSource: DataSource,
        request: ExpressRequest,
    ) {
        const repository: Repository<T> = dataSource.getRepository(entity);
        this.#queryBuilder = repository.createQueryBuilder();
        this.#parsedQs = new QuerystringParser(request.url).parse();
    }

    #parsePath(path: string): (string | number)[] {
        return path
            .split('.')
            .map(x => {
                if (x.match(/^[0-9]*$/gi)) {
                    return parseInt(x);
                } else {
                    return x;
                }
            });
    }

    #objectGet<V = any>(
        target: Record<any, any> | any[],
        path: string
    ): V {
        let out: any = target;
        const parsedPath = this.#parsePath(path);
        while (true) {
            if (out == null || parsedPath.length === 0) {
                return out;
            }

            const prop = parsedPath.shift();
            if (prop) {
                out = out[prop];
            }
        }
    }

    #objectSet(
        target: Record<any, any> | any[],
        path: string,
        value: any
    ): void {
        const parsedPath = this.#parsePath(path);
        let out: any = target;
        while (true) {
            const prop = parsedPath.unshift();
            if (prop == null) {
                return;

            } else if (parsedPath.length === 0) {
                out[prop] = value;
                return;

            } else {
                if (out[prop] == null) {
                    out[prop] = {};
                }

                out = out[prop];
            }
        }
    }

    async getMany(findOptions: FindManyOptions<T>): Promise<GridView<T>> {
        const { take, skip, sort, filter } = this.#parsedQs;
        sort?.forEach(({ field, dir }) => {
            if (dir != null) {
                this.#objectSet(findOptions, field, dir);
            }
        });

        let qb = this.#queryBuilder.setFindOptions(findOptions);
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