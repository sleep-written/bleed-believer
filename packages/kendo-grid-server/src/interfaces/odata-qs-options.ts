import type { CompositeFilterDescriptor } from '@progress/kendo-data-query';
import type { PageChangeEvent } from './page-change-event.js';
import type { SortDescriptor } from './sort-descriptor.js';

export interface ODataQsOptions {
    pagination?: PageChangeEvent;
    filter?: CompositeFilterDescriptor;
    sort?: SortDescriptor[];
}