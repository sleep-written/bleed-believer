import { GridDataResult, ODataQsOptions, odataQsBuilder } from '@bleed-believer/kendo-grid-client';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Post } from '@entities/post.entity';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(
    private _http: HttpClient
  ) { }

  get(options: ODataQsOptions): Promise<GridDataResult<Post>> {
    const qs = odataQsBuilder(options, true);
    const rs = this._http.get<GridDataResult<Post>>(`post${qs}`);
    return firstValueFrom(rs);
  }
}
