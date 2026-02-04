import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonacoEditor } from './monaco-editor.js';

@NgModule({
  declarations: [
    MonacoEditor
  ],
  imports: [
    CommonModule
  ],
  exports: [
    MonacoEditor
  ]
})
export class MonacoEditorModule { }
