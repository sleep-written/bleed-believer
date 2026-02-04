import type { OnInit, AfterViewInit, OnDestroy } from '@angular/core';

import { ElementRef, input, model, ChangeDetectionStrategy, Component, effect, output, viewChild } from '@angular/core';
import * as monaco from 'monaco-editor';

import { createEnvironment } from './create-environment.js';
import { deepEqual } from './deep-equal.js';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './monaco-editor.html',
  standalone: false,
  styleUrl: './monaco-editor.scss',
  selector: 'bleed-monaco-editor'
})
export class MonacoEditor implements OnInit, AfterViewInit, OnDestroy {
  #disposables = new Set<{ dispose(): unknown; }>();
  #editor?: monaco.editor.IStandaloneCodeEditor;
  #effect = effect(this.effect.bind(this));

  container = viewChild.required<ElementRef<HTMLElement>>('container');
  language = input('plaintext');
  value = model('');
  blur = output<void>();
  
  options = input<monaco.editor.IEditorOptions>({
    fixedOverflowWidgets: true,
    automaticLayout: true,
  });

  ngOnInit(): void {
    createEnvironment();
  }

  async ngAfterViewInit(): Promise<void> {
    const container = this.container().nativeElement;
    this.#editor = monaco.editor.create(container, {
      ...this.options(),
      value: this.value(),
      language: this.language()
    });

    this.#disposables.add(
      this.#editor.onDidChangeModelContent(this.onDidChangeModelContent.bind(this))
    );

    this.#disposables.add(
      this.#editor.onDidBlurEditorText(this.onDidBlurEditorText.bind(this))
    );
  }

  ngOnDestroy(): void {
    Array
      .from(this.#disposables.values())
      .forEach(x => {
        x.dispose();
        this.#disposables.delete(x);
      });

    this.#effect.destroy();
    this.#editor?.dispose();
  }

  onDidChangeModelContent(): void {
    const value = this.#editor?.getValue() ?? '';
    if (this.#editor && value !== this.value()) {
      this.value.set(value);
    }
  }

  onDidBlurEditorText(): void {
    this.blur.emit();
  }

  effect(): void {
    const value = this.value();
    const language = this.language();
    const externalOptions = this.options();

    let model = this.#editor?.getModel();
    if (model) {
      if (model.getLanguageId() !== language) {
        monaco.editor.setModelLanguage(model, language);
      }

      if (model.getValue() !== value) {
        model.setValue(value);
      }
    }

    // Update options
    const internalOptions = this.#editor?.getRawOptions();
    if (internalOptions && !deepEqual(internalOptions, externalOptions)) {
      this.#editor?.updateOptions(externalOptions);
    }
  }
}
