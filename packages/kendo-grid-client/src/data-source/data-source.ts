import type { DataSourceRequest } from '../interfaces/index.js';

import { stringifyFilter } from './stringify-filter.js';
import { stringifySort } from './stringify-sort.js';

export class DataSource {
    static stringify(
        dataSource: DataSourceRequest,
        appendQuestionMark?: boolean
    ): string {
        const { take, skip, sort, filter } = dataSource;
        const out: string[] = [];

        if (typeof take === 'number') {
            out.push(`$top=${take}`);
        }

        if (typeof skip === 'number') {
            out.push(`$skip=${skip}`);
        }

        if (sort instanceof Array) {
            out.push(`$orderby=${stringifySort(sort)}`);
        }
        
        if (filter != null) {
            out.push(`$filter=${stringifyFilter(filter)}`);
        }

        return appendQuestionMark && out.length > 0
            ?   '?' + out.join('&')
            :   out.join('&');
    }
}