import type { PagerSettings, SortSettings, FilterableSettings } from '@progress/kendo-angular-grid';
import type { ChangeDetectorRef, PageChangeEvent, DataSource } from './interfaces/index.js';
import type { CompositeFilterDescriptor, SortDescriptor } from '@progress/kendo-data-query';

export abstract class GridComponent<T extends Record<string, any>> {
    #changeDet?: ChangeDetectorRef;
    loading = false;

    skip = 0;
    pageSize = 10;
    pageable: PagerSettings = {
        pageSizes: [ 10, 20, 50, 100 ],
        position: 'bottom',
        type: 'numeric',
        info: true,
    };

    sort: SortDescriptor[] = [];
    sortable: SortSettings = {
        mode: 'multiple',
        allowUnsort: true
    }

    filter: CompositeFilterDescriptor = {
        filters: [],
        logic: 'and'
    };
    filterable: FilterableSettings = 'menu';

    #dataSource: DataSource<T> = {
        data: [],
        total: 0
    };
    get data(): DataSource<T> {
        return this.#dataSource;
    }

    constructor(changeDet?: ChangeDetectorRef) {
        this.#changeDet = changeDet;
    }

    /**
     * Callback for `pageChange` event.
     * @param e `PageChangeEvent` instance.
     */
    onPageChange(e: PageChangeEvent): Promise<void> {
        this.pageSize = e.take;
        this.skip = e.skip;
        return this.update();
    }

    /**
     * Callback for `sortChange` event.
     * @param e `SortDescriptor` array instance.
     */
    onSortChange(e: SortDescriptor[]) {
        this.skip = 0;
        this.sort = e;
        return this.update();
    }

    /**
     * Callback for `filterChange` event.
     * @param e `CompositeFilterDescriptor` instance.
     */
    onFilterChange(e: CompositeFilterDescriptor): Promise<void> {
        this.skip = 0;
        this.filter = e;
        return this.update();
    }

    async update(): Promise<void> {
        try {
            this.loading = true;
            this.#changeDet?.detectChanges();

            this.#dataSource = await this.getData() ?? {
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

    abstract getData(): Promise<DataSource<T> | null>;
}
