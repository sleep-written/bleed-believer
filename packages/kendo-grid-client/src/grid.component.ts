import type { PagerSettings, SortSettings, FilterableSettings, PageChangeEvent } from '@progress/kendo-angular-grid';
import type { ChangeDetectorRef, GridView, GridViewRequest } from './interfaces/index.js';
import type { CompositeFilterDescriptor, SortDescriptor } from '@progress/kendo-data-query';

/**
 * An abstract base class designed to simplify the integration and management of
 * grid components within Angular applications using `@progress/kendo-angular-grid`.
 * It encapsulates common grid functionalities such as pagination, sorting, and filtering,
 * managing the grid state and data requests in a cohesive manner. This class must be
 * extended by concrete components that implement the `getData` method to fetch grid data
 * according to the `GridViewRequest` parameters.
 *
 * @typeParam T - The type of the data items displayed in the grid. This generic type
 * extends `Record<string, any>`, accommodating a wide variety of data shapes.
 */
export abstract class GridComponent<T extends Record<string, any>> {
    #changeDet?: ChangeDetectorRef;
    loading = false;

    /**
     * The current offset from the beginning of the dataset. Used for pagination,
     * determining which page of data is currently being viewed.
     */
    skip = 0;

    /**
     * The number of items to display on each page of the grid. This value can be
     * adjusted to increase or decrease the number of items per page.
     */
    pageSize = 10;

    /**
     * Settings for the grid's pager component, configuring options like page sizes,
     * position, and the presence of pagination info.
     */
    pageable: PagerSettings = {
        pageSizes: [10, 20, 50, 100],
        position: 'bottom',
        type: 'numeric',
        info: true,
    };

    /**
     * An array of `SortDescriptor` objects defining the current sorting state of the
     * grid. This state influences the order in which data is displayed.
     */
    sort: SortDescriptor[] = [];

    /**
     * Configuration for the grid's sorting behavior, including the sorting mode and
     * whether unsorting is allowed.
     */
    sortable: SortSettings = {
        mode: 'multiple',
        allowUnsort: true
    }

    /**
     * The current filter state of the grid, represented by a `CompositeFilterDescriptor`.
     * This state determines which items are visible in the grid based on the defined
     * filter criteria.
     */
    filter: CompositeFilterDescriptor = {
        filters: [],
        logic: 'and'
    };

    /**
     * Configuration for the grid's filtering behavior, specifying how users can interact
     * with the filter UI.
     */
    filterable: FilterableSettings = 'menu';

    #data: GridView<T> = {
        data: [],
        total: 0
    };

    /**
     * The current grid data and total count, encapsulated in a `GridView` object.
     * This property is read-only and is updated via the `update` method.
     */
    get data(): GridView<T> {
        return this.#data;
    }

    /**
     * Constructs the current grid view request object, encapsulating the current
     * state of pagination, sorting, and filtering parameters.
     */
    get dataRequest(): GridViewRequest {
        return {
            skip: this.skip,
            sort: this.sort,
            filter: this.filter,
            pageSize: this.pageSize,
        }
    }

    /**
     * Initializes a new instance of the `GridComponent` class, optionally accepting
     * a `ChangeDetectorRef` for manual change detection control.
     * @param changeDet Optional `ChangeDetectorRef` for triggering change detection manually.
     */
    constructor(changeDet?: ChangeDetectorRef) {
        this.#changeDet = changeDet;
    }

    /**
     * Handles the `pageChange` event, updating the grid's pagination state and
     * refreshing the grid data accordingly.
     * @param e The `PageChangeEvent` triggered by the grid component.
     * @returns A promise resolved once the grid data has been updated.
     */
    onPageChange(e: PageChangeEvent): Promise<void> {
        this.pageSize = e.take;
        this.skip = e.skip;
        return this.update();
    }

    /**
     * Handles the `sortChange` event, updating the grid's sort state and refreshing
     * the grid data accordingly.
     * @param e An array of `SortDescriptor` indicating the new sort order.
     * @returns A promise resolved once the grid data has been updated.
     */
    onSortChange(e: SortDescriptor[]) {
        this.skip = 0;
        this.sort = e;
        return this.update();
    }

    /**
     * Handles the `filterChange` event, updating the grid's filter state and
     * refreshing the grid data accordingly.
     * @param e The `CompositeFilterDescriptor` indicating the new filter criteria.
     * @returns A promise resolved once the grid data has been updated.
     */
    onFilterChange(e: CompositeFilterDescriptor): Promise<void> {
        this.skip = 0;
        this.filter = e;
        return this.update();
    }

    /**
     * Triggers a data update for the grid, fetching new data based on the current
     * state of pagination, sorting, and filtering. This method manages the loading
     * state and ensures that any changes are reflected in the view.
     * @returns A promise resolved once the grid has been updated with new data.
     */
    async update(): Promise<void> {
        try {
            this.loading = true;
            this.#changeDet?.detectChanges();

            this.#data = await this.getData() ?? {
                data: [],
                total: 0
            };
            
            this.loading = false;
            this.#changeDet?.detectChanges();
        } catch (e: any) {
            this.loading = false;
            this.#changeDet?.detectChanges();

            throw e;
        }
    }

    /**
     * An abstract method that must be implemented by subclasses to fetch grid data.
     * This method should return a `GridView<T>` object containing the data and total
     * count, or `null` if no data is available.
     * @abstract
     * @returns A promise resolved with a `GridView<T>` object or `null`.
     */
    abstract getData(): Promise<GridView<T> | null>;
}
