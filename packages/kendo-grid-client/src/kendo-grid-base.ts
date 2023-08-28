import type { FilterableSettings, PageChangeEvent, PagerSettings, SortSettings } from '@progress/kendo-angular-grid';
import type { CompositeFilterDescriptor, SortDescriptor } from '@progress/kendo-data-query';

import type { GridDataResult } from './interfaces/index.js';

export abstract class KendoGridBase<T> {
  /**
   * An object that stores que result given by the server.
   */
  data: GridDataResult<T> = {
    data: [],
    total: 0
  };

  /**
   * Options for the pagination. You can override this setting if you want.
   */
  pageable: PagerSettings = {
    responsive: true,
    info: true,
  };

  /**
   * Options for the sort mechanism. You can override this setting if you want.
   */
  sortable: SortSettings = {
    allowUnsort: true,
    mode: 'single'
  };

  /**
   * Represents the options for the filterable setting of the Grid.
   */
  filterable: FilterableSettings = 'menu';

  /**
   * Defines the number of records to be skipped by the pager.
   */
  skip = 0;

  /**
   * Stores the current active sorts
   */
  sort: SortDescriptor[] = [];

  /**
   * The descriptor by which the data will be filtered.
   */
  filter: CompositeFilterDescriptor = {
    filters: [],
    logic: 'and'
  }

  /**
   * Defines the page size used by the Grid pager.
   */
  pageSize = 10;

  /**
   * Gets the current state of the paginator.
   */
  get pagination(): PageChangeEvent {
    return {
      take: this.pageSize,
      skip: this.skip
    };
  }

  onPageChange(e: PageChangeEvent): void {
    this.pageSize = e.take;
    this.skip = e.skip;
    this.getData();
  }

  onSortChange(e: SortDescriptor[]): void {
    this.sort = e;
    this.getData();
  }

  onFilterChange(e: CompositeFilterDescriptor): void {
    this.filter = e;
    this.getData();
  }

  abstract getData(): Promise<void>;
}