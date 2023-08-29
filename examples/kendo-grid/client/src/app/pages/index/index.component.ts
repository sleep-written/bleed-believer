import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { KendoGridBase } from '@bleed-believer/kendo-grid-client';
import { SortSettings } from '@progress/kendo-angular-grid';

import { PostService } from '@services/post';
import { Post } from '@entities/post.entity';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IndexComponent extends KendoGridBase<Post> implements OnInit {
  loading = false;
  override sortable: SortSettings = {
    mode: 'multiple'
  };

  constructor(
    private _postServ: PostService,
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

    const data = await this._postServ.get({
      pagination: this.pagination,
      filter: this.filter,
      sort: this.sort,
    });

    this.data = data;
    this.loading = false;
    this._changeDet.detectChanges();
  }
}
