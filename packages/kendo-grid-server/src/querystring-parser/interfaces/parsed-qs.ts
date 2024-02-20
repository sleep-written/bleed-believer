import type { CompositeFilterDescriptor, SortDescriptor } from '@progress/kendo-data-query';

export interface ParsedQs {
    take?: number;
    skip?: number;
    sort?: SortDescriptor[];
    filter?: CompositeFilterDescriptor;
}