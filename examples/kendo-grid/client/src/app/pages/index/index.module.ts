import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexRoutingModule } from './index-routing.module';

import { IndexComponent } from './index.component';

// Material modules
import { MatCardModule } from '@angular/material/card';

// Progress modules
import { GridModule } from '@progress/kendo-angular-grid';

@NgModule({
  declarations: [
    IndexComponent
  ],
  imports: [
    CommonModule,
    IndexRoutingModule,

    // Material modules
    MatCardModule,

    // Progress modules
    GridModule,
  ]
})
export class IndexModule { }
