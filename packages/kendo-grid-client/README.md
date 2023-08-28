# @bleed-believer/kendo-grid-client

## Quick Start

### 1. Define Your Data Interface

First, create an interface that describes the data for each row in your table. For instance:

```ts
export interface Dummy {
    id: number;
    cod: string;
    descripc: string;
}
```

### 2. Create a Service to Fetch Data

Create a service that fetches the data as an array of objects that implement the above interface:

```ts
import { GridDataResult, ODataQsOptions, odataQsBuilder } from '@bleed-believer/kendo-grid-client';
import { firstValueFrom } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http/index.js';
import { Dummy } from '@entities/dummy.entity';

@Injectable({
  providedIn: 'root'
})
export class DummyService {
  constructor(private _httpClient: HttpClient) {}

  get(options: ODataQsOptions): Promise<GridDataResult<Dummy>> {
    const qs = odataQsBuilder(options, true);
    const rs = this._httpClient.get<GridDataResult<Dummy>>(`/dummy${qs}`);
    return firstValueFrom(rs);
  }
}
```

### 3. Create Your Component

Extend the `KendoGridBase` class and implement the `getData()` abstract method to fetch and assign data to `this.data`:

```ts
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { KendoGridBase } from '@bleed-believer/kendo-grid-client';
import { SortSettings } from '@progress/kendo-angular-grid';
import { DummyService } from '@services/dummy';
import { Dummy } from '@entities/dummy.entity';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IndexComponent extends KendoGridBase<Dummy> implements OnInit {
  loading = false;
  override sortable: SortSettings = {
    mode: 'multiple'
  };

  constructor(
    private _dummyServ: DummyService,
    private _changeDet: ChangeDetectorRef,
  ) {
    super();
  }

  ngOnInit(): void {
    this.getData();
  }

  async getData(): Promise<void> {
    this.loading = true;
    this._changeDet.detectChanges();

    const data = await this._dummyServ.get({
      pagination: this.pagination,
      filter: this.filter,
      sort: this.sort,
    });

    this.data = data;
    this.loading = false;
    this._changeDet.detectChanges();
  }
}
```

### 4. Bind Component Properties in HTML

In your HTML template, bind the properties of the `<kendo-grid>` component to the properties of your class:

```html
<mat-card>
    <mat-card-header>
        <mat-card-title>Dummy table</mat-card-title>
    </mat-card-header>

    <mat-card-content>
        <kendo-grid
        [data]="this.data"
        [skip]="this.skip"
        [sort]="this.sort"
        [filter]="this.filter"
        [loading]="this.loading"
        [pageable]="this.pageable"
        [pageSize]="this.pageSize"
        [sortable]="this.sortable"
        [filterable]="this.filterable"
        (pageChange)="this.onPageChange($event)"
        (sortChange)="this.onSortChange($event)"
        (filterChange)="this.onFilterChange($event)">
    
        </kendo-grid>
    </mat-card-content>
</mat-card>
```
## Final Notes

- This package is designed to work in tandem with `@bleed-believer/kendo-grid-server`. It's essential to use both packages together for the full functionality and seamless experience.

- Ensure that you have installed all the prerequisites and follow the guidelines for setting up both packages.

