import type { ControlValueAccessor } from '@angular/forms';
import type { MonacoEditorOptions } from './monaco-editor-options.js';

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, computed, forwardRef, inject, input, model } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  templateUrl: './monaco-editor-ctrl.html',
  styleUrl: './monaco-editor-ctrl.scss',
  selector: 'bleed-monaco-editor-ctrl',

  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MonacoEditorCtrl),
      multi: true,
    },
  ]
})
export class MonacoEditorCtrl implements ControlValueAccessor {
  #onChange = (_: any) => {};
  #onTouched = () => {};
  #changeDet = inject(ChangeDetectorRef);

  value = model<string>();
  options = input<MonacoEditorOptions>({});

  disabled = model<boolean>(false);
  readonly = model<boolean>(false);
  language = input<string>();

  rawOptions = computed(() => {
    return {
      ...(this.options()),
      readOnly:     this.disabled() || this.readonly(),
      domReadOnly:  this.disabled() || this.readonly()
    };
  });

  writeValue(obj: any): void {
    const value = typeof obj === 'string'
    ? obj
    : '';

    this.value.set(value);
    this.#changeDet.detectChanges();
  }

  registerOnChange(fn: any): void {
    this.#onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.#onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  onBlur(): void {
    this.#onTouched();
  }

  onValueChange(value: string): void {
    this.value.set(value);
    this.#onChange(value);
    this.#onTouched();
  }
}
