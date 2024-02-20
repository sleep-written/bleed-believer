import type { CompositeFilterDescriptor, SortDescriptor } from '@progress/kendo-data-query';
import type { PagerSettings, SortSettings } from '@progress/kendo-angular-grid';

import type { ChangeDetectorRef, PageChangeEvent, GridView } from './interfaces/index.js';

export abstract class GridComponent<T extends Record<string, any>> {
    #changeDet?: ChangeDetectorRef;

    loading = false;
    take = 10;
    skip = 0;
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

    #dataSource: GridView<T> = {
        data: [],
        total: 0
    };
    get dataSource(): GridView<T> {
        return this.#dataSource;
    }

    constructor(changeDet?: ChangeDetectorRef) {
        this.#changeDet = changeDet;
    }

    onPageChange(e: PageChangeEvent): Promise<void> {
        this.take = e.take;
        this.skip = e.skip;
        return this.refresh();
    }

    onSortChange(e: SortDescriptor[]) {
        this.skip = 0;
        this.sort = e;
        return this.refresh();
    }

    onFilterChange(e: CompositeFilterDescriptor): Promise<void> {
        this.skip = 0;
        this.filter = e;
        return this.refresh();
    }

    async refresh(): Promise<void> {
        try {
            this.loading = true;
            this.#changeDet?.detectChanges();

            this.#dataSource = await this.getData();
            
            this.loading = false;
            this.#changeDet?.detectChanges();
        } catch (e: any) {
            this.loading = false;
            this.#changeDet?.detectChanges();

            throw e;
        }
    }

    abstract getData(): Promise<GridView<T>>;
}
