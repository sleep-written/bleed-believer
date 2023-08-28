import type { ODataQsOptions } from './interfaces/index.js';

export function odataQsBuilder(options: ODataQsOptions, prefix?: boolean): any {
    const  { pagination, filter, sort } = options;
    let out = '';

    if (pagination?.take) {
        out += `take=${pagination?.take}`;
    }

    if (pagination?.skip) {
        if (out.length > 0) { out += '&'; }
        out += `skip=${pagination?.skip}`;
    }

    if (filter) {
        if (out.length > 0) { out += '&'; }
        out += 'filter=';
        out += encodeURIComponent(JSON.stringify(filter));
    }

    if (sort) {
        const filteredSort = sort.filter(({ dir }) => typeof dir === 'string');
        if (filteredSort.length > 0) {
            if (out.length > 0) { out += '&'; }
            out += 'sort=';
            out += filteredSort
                .map(({ field, dir }) => `${field}(${dir})`)
                .join(';');
        }
    }

    return prefix
        ?   `?${out}`
        :   out;
}