import type { CompositeFilterDescriptor, FilterDescriptor, SortDescriptor } from '@progress/kendo-data-query';
import type { DataSourceRequest } from './interfaces/index.js';

export class OData {
    #request: DataSourceRequest;
    constructor(request: DataSourceRequest) {
        this.#request = request;
    }

    stringifySort(s: SortDescriptor[]): string {
        const sort = s
            .filter(({ dir }) => {
                switch (dir) {
                    case 'asc':
                    case 'desc': {
                        return true;
                    }
                    default: {
                        return false;
                    }
                }
            })
            .map(({ field, dir }) => `${field} ${dir ?? 'asc'}`)
            .join(',');
    
        return encodeURIComponent(sort);
    }

    stringifyFilter(d: CompositeFilterDescriptor | FilterDescriptor): string {
        const txt = JSON.stringify(d);
        return encodeURIComponent(txt);
    }

    stringify(
        appendQuestionMark?: boolean
    ): string {
        const { pageSize, skip, sort, filter } = this.#request;
        const parts: string[] = [];

        if (typeof pageSize === 'number') {
            parts.push(`$top=${pageSize}`);
        }

        if (typeof skip === 'number') {
            parts.push(`$skip=${skip}`);
        }

        if (sort instanceof Array) {
            parts.push(`$orderby=${this.stringifySort(sort)}`);
        }
        
        if (filter != null) {
            parts.push(`$filter=${this.stringifyFilter(filter)}`);
        }

        if (appendQuestionMark) {
            return `?${parts.join('&')}`;
        } else {
            return parts.join('&');
        }
    }
}