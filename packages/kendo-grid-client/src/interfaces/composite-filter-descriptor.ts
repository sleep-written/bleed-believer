import type { FilterDescriptor } from './filter-descriptor.js';

/**
 * A complex filter expression. For more information, refer to the [filterBy]({% slug api_kendo-data-query_filterby %}) method.
 */
export interface CompositeFilterDescriptor {
    /**
     * The logical operation to use when the `filter.filters` option is set.
     *
     * The supported values are:
     * * `"and"`
     * * `"or"`
     */
    logic: 'or' | 'and';
    /**
     * The nested filter expressions&mdash;either [FilterDescriptor]({% slug api_kendo-data-query_filterdescriptor %}), or [CompositeFilterDescriptor]({% slug api_kendo-data-query_compositefilterdescriptor %}). Supports the same options as `filter`. You can nest filters indefinitely.
     */
    filters: Array<FilterDescriptor | CompositeFilterDescriptor>;
}