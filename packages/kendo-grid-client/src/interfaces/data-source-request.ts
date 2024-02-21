import type { CompositeFilterDescriptor, FilterDescriptor, SortDescriptor } from '@progress/kendo-data-query';

export interface DataSourceRequest {
    pageSize?: number;
    skip?: number;
    sort?: SortDescriptor[];
    filter?: CompositeFilterDescriptor | FilterDescriptor;
}