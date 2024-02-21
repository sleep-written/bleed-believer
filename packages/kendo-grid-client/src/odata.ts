import type { CompositeFilterDescriptor, FilterDescriptor, SortDescriptor } from '@progress/kendo-data-query';
import type { GridViewRequest } from './interfaces/index.js';

/**
 * Provides functionality to convert a `GridViewRequest` into a query string
 * suitable for `@bleed-believer/kendo-grid-server`. This class handles the
 * serialization of sorting and filtering criteria into a simplified custom
 * OData-like format, allowing the server to understand and process client
 * requests efficiently. The resulting query string is not standard OData but
 * a tailored version designed to work seamlessly with the server-side
 * counterpart of this library.
 */
export class OData {
    #request: GridViewRequest;

    /**
     * Initializes a new instance of the `OData` class with the provided grid view request.
     * @param request The `GridViewRequest` containing pagination, sorting, and filtering parameters.
     */
    constructor(request: GridViewRequest) {
        this.#request = request;
    }

    /**
     * Converts an array of `SortDescriptor` objects into a string representation for
     * the query string. Only sort descriptors with a direction of 'asc' or 'desc' are
     * included.
     * @param s An array of `SortDescriptor` objects.
     * @returns A string representation of the sorting criteria, encoded for use in a URL.
     */
    #stringifySort(s: SortDescriptor[]): string {
        const sort = s
            .filter(({ dir }) => dir === 'asc' || dir === 'desc')
            .map(({ field, dir }) => `${field} ${dir}`)
            .join(',');
    
        return encodeURIComponent(sort);
    }

    /**
     * Converts a `CompositeFilterDescriptor` or `FilterDescriptor` into a string
     * representation for the query string.
     * @param d The filter descriptor, either composite or simple.
     * @returns A string representation of the filter criteria, encoded for use in a URL.
     */
    #stringifyFilter(d: CompositeFilterDescriptor | FilterDescriptor): string {
        const txt = JSON.stringify(d);
        return encodeURIComponent(txt);
    }

    /**
     * Compiles the `GridViewRequest` into a query string, optionally prefixed with
     * a question mark. This method orchestrates the conversion of pagination, sorting,
     * and filtering parameters into their string representations.
     * @param appendQuestionMark If `true`, the resulting query string is prefixed with a question mark, making it ready for appending to a URL.
     * @returns The compiled query string based on the current state of the `GridViewRequest`.
     */
    stringify(appendQuestionMark?: boolean): string {
        const { pageSize, skip, sort, filter } = this.#request;
        const parts: string[] = [];

        if (typeof pageSize === 'number') {
            parts.push(`$top=${pageSize}`);
        }

        if (typeof skip === 'number') {
            parts.push(`$skip=${skip}`);
        }

        if (Array.isArray(sort)) {
            parts.push(`$orderby=${this.#stringifySort(sort)}`);
        }
        
        if (filter != null) {
            parts.push(`$filter=${this.#stringifyFilter(filter)}`);
        }

        if (appendQuestionMark) {
            return `?${parts.join('&')}`;
        } else {
            return parts.join('&');
        }
    }
}
