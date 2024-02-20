import type { CompositeFilterDescriptor } from './composite-filter-descriptor.js';
import type { FilterDescriptor } from './filter-descriptor.js';
import type { SortDescriptor } from './sort-descriptor.js';

export interface DataSourceRequest {
    take?: number;
    skip?: number;
    sort?: SortDescriptor[];
    filter?: CompositeFilterDescriptor | FilterDescriptor;
}