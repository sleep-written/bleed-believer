import type { FilterOperator } from './filter-operator.js';

/**
 * A basic filter expression. Usually is a part of [CompositeFilterDescriptor]({% slug api_kendo-data-query_compositefilterdescriptor %}).
 *
 * For more information on filtering the provided data array, refer to the [filterBy]({% slug api_kendo-data-query_filterby %}) method.
 * For examples on using the `FilterDescriptor`, refer to the [documentation on filtering the Grid]({% slug filtering_grid %}).
 */
export interface FilterDescriptor {
    /**
     * The data item field to which the filter operator is applied.
     */
    field?: string | Function;
    /**
     * The filter operator (comparison).
     *
     * The supported operators are:
     * * `"eq"` (equal to)
     * * `"neq"` (not equal to)
     * * `"isnull"` (is equal to null)
     * * `"isnotnull"` (is not equal to null)
     * * `"lt"` (less than)
     * * `"lte"` (less than or equal to)
     * * `"gt"` (greater than)
     * * `"gte"` (greater than or equal to)
     *
     * The following operators are supported for string fields only:
     * * `"startswith"`
     * * `"endswith"`
     * * `"contains"`
     * * `"doesnotcontain"`
     * * `"isempty"`
     * * `"isnotempty"`
     */
    operator: FilterOperator | string | Function;
    /**
     * The value to which the field is compared. Has to be of the same type as the field.
     */
    value?: any;
    /**
     * Determines if the string comparison is case-insensitive.
     */
    ignoreCase?: boolean;
}