import type { CompositeFilterDescriptor, SortDescriptor } from '@progress/kendo-data-query';
import type { PageChangeEvent } from '@progress/kendo-angular-grid';

export interface ODataQsOptions {
    pagination?: PageChangeEvent;
    filter?: CompositeFilterDescriptor;
    sort?: SortDescriptor[];
}