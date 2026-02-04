import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonacoEditorModule } from '../monaco-editor/index.js';

import { MonacoEditorCtrl } from './monaco-editor-ctrl.js';

@NgModule({
  declarations: [
    MonacoEditorCtrl
  ],
  imports: [
    CommonModule,
    MonacoEditorModule
  ],
  exports: [
    MonacoEditorCtrl
  ]
})
export class MonacoEditorCtrlModule { }
