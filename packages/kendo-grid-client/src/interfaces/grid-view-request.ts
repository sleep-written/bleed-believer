import type { CompositeFilterDescriptor, FilterDescriptor, SortDescriptor } from '@progress/kendo-data-query';

/**
 * Defines the structure for grid view requests, encapsulating parameters for
 * pagination, sorting, and filtering. This interface serves as a contract for
 * frontend components to request data in a structured manner that aligns with
 * backend expectations, facilitating the dynamic and efficient retrieval of
 * data for display in grids, particularly with the `@progress/kendo-angular-grid`.
 * It leverages types from `@progress/kendo-data-query` for sorting and filtering
 * to ensure compatibility and ease of use.
 */
export interface GridViewRequest {
    /**
     * The number of items to be returned in the grid view, used for pagination.
     * This determines how many items are displayed on one page.
     */
    pageSize?: number;

    /**
     * The number of items to skip before starting to return items, used for
     * pagination. This helps in navigating through pages by skipping a set
     * number of items.
     */
    skip?: number;

    /**
     * An array of `SortDescriptor` objects defining the sorting criteria for
     * the data. Each `SortDescriptor` specifies the field to sort by and the
     * direction of the sort (ascending or descending).
     */
    sort?: SortDescriptor[];

    /**
     * A filter descriptor that can be either a single `FilterDescriptor` or a
     * `CompositeFilterDescriptor`. This defines the filtering criteria applied
     * to the data, allowing for complex filtering logic including combinations
     * of filters.
     */
    filter?: CompositeFilterDescriptor | FilterDescriptor;
}
