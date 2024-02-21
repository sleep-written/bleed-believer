# @bleed-believer/kendo-grid-client
This library is a sophisticated tool designed to streamline the integration of dynamic and responsive tables in Angular applications, leveraging the capabilities of `@progress/kendo-angular-grid`. It simplifies the creation of grid components by providing structured bindings for pagination, sorting, and filtering, alongside generating a query string for backend communication based on a simplified version of the OData protocol. This library is specifically crafted to work in tandem with `@bleed-believer/kendo-grid-server`, ensuring a seamless front-to-back data flow.

## Features
- Simplifies dynamic data table implementations in Angular applications.
- Supports pagination, sorting, and filtering with minimal setup.
- Generates backend-compatible query strings using a custom OData-like protocol.
- Designed to be used with `@progress/kendo-angular-grid` for front-end components and `@bleed-believer/kendo-grid-server` for backend data handling.
- Compatible with Angular 17.

## Installation
To integrate this library into your project, run the following command:
```bash
npm install --save @bleed-believer/kendo-grid-client
```

Ensure that you have `@progress/kendo-angular-grid` and `@progress/kendo-data-query` installed in your project, as they are peer dependencies required for this library to function correctly. You can install them using this command:
```bash
npx ng add @progress/kendo-angular-grid
```

## Quick Start
Below is a quick overview of how to use `@bleed-believer/kendo-grid-client` in your Angular application. This example assumes you have basic familiarity with Angular and its service/component architecture.

### Models
First, define models that represent your data structures. These models will be used by both the service for fetching data and the grid component for displaying it.

```ts
// category.entity.ts
export interface Category {
    id: number;
    cod: string;
    descript: string;
    dummies?: Dummy[];
}

// dummy.entity.ts
export interface Dummy {
    id: number;
    text: string;
    value: number;
    date: Date;
    category?: Category;
}
```

### Service

Create a service that fetches data from the backend. Use `GridViewRequest` for the request and expect a `GridView` response.
```ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Dummy } from '@entities/dummy.entity';

import { OData, GridView, GridViewRequest } from '@bleed-believer/kendo-grid-client';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DummyService {
  headers = {
    'content-type': 'application/json; charset=utf-8'
  } as const;

  constructor(
    private _httpClient: HttpClient,
  ) { }

  async get(req: GridViewRequest): Promise<GridView<Dummy>> {
    const qs = new OData(req).stringify(true);
    const ob = this._httpClient.get<GridView<Dummy>>(`/dummy/raw${qs}`, {
      headers: this.headers,
      responseType: 'json'
    });

    // Waiting to get the response
    const res = await firstValueFrom(ob);

    // Example of data parsing logic, showcasing
    // the flexibility of handling data.
    res.data.forEach(x => {
      const [ year, month, day ] = (x.date)
        .toString()
        .split('-')
        .map(n => parseInt(n));

      x.date = new Date(year, month -2, day);
    })

    return res;
  }
}
```

### Component
Implement a grid component by extending `GridComponent` from `@bleed-believer/kendo-grid-client`. Override necessary methods like `getData` to fetch data using the service.
```ts
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { GridModule, PagerSettings } from '@progress/kendo-angular-grid';
import { GridView, GridComponent } from '@bleed-believer/kendo-grid-client';
import * as dateFns from 'date-fns';

import { DummyService } from '@services/dummy';
import { Dummy } from '@entities/dummy.entity';

@Component({
  selector: 'app-table-demo',
  standalone: true,
  imports: [
    GridModule
  ],
  templateUrl: './table-demo.component.html',
  styleUrl: './table-demo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableDemoComponent extends GridComponent<Dummy> implements OnInit {
  override pageable: PagerSettings = {
    type: 'numeric',
    pageSizes: [ 10, 50, 100, 1000 ]
  };

  constructor(
    private _dummyServ: DummyService,
    changeDet: ChangeDetectorRef,
  ) {
    super(changeDet);
  }

  ngOnInit(): void {
    this.update();
  }

  formatDate(dummy: Dummy): string {
    return dateFns.format(dummy.date, 'yyyy/MM/dd');
  }

  override async getData(): Promise<GridView<Dummy> | null> {
    try {
      // Fetch the data using the service
      const resp = await this._dummyServ.get(this.dataRequest);
      return resp;
    } catch (err) {
      // Error handling can be customized here.
      console.error(err);
      return null;
    }
  }
}
```

### Template
Utilize `kendo-grid` in your component's template, binding it to your component's data properties and event handlers.
```html
<kendo-grid
[data]="this.data"
[sort]="this.sort"
[skip]="this.skip"
[filter]="this.filter"
[loading]="this.loading"
[pageable]="this.pageable"
[pageSize]="this.pageSize"
[sortable]="this.sortable"
[filterable]="this.filterable"
(pageChange)="this.onPageChange($event)"
(sortChange)="this.onSortChange($event)"
(filterChange)="this.onFilterChange($event)">
    <kendo-grid-column
    title="Text"
    field="text">
    </kendo-grid-column>

    <kendo-grid-column
    text="Computed"
    field="calc"
    filter="numeric">
    </kendo-grid-column>

    <kendo-grid-column
    text="Date"
    field="date"
    filter="date">
        <ng-template kendoGridCellTemplate let-item>
            {{ this.formatDate(item) }}
        </ng-template>
    </kendo-grid-column>
    
    <kendo-grid-column
    title="Category cod"
    field="categoryCod">
    </kendo-grid-column>
    
    <kendo-grid-column
    title="Category descripct"
    field="categoryDescript">
    </kendo-grid-column>
</kendo-grid>
```

## Conclusion

`@bleed-believer/kendo-grid-client` offers a powerful and elegant solution for integrating complex grid functionalities in your Angular applications with minimal overhead. By following the steps outlined above, you can quickly set up dynamic tables that are both responsive and efficient.
