import type { StateFormStruct } from './interfaces/index.js';

import { filter, Observable, map } from 'rxjs';
import { FormGroup, FormControl } from '@angular/forms';

/**
 * An extension of `FormGroup` from [@angular/forms](https://angular.io/api/forms/FormGroup)
 * with alternative methods to change its internal value and listen for changes.
 */
export class StateFormGroup<T extends Record<string, any>> extends FormGroup {
    #ready = true;

    /**
     * This is a variant of `this.valueChanges`, but this observer ignores all
     * calls from `this.setValueSilently` and `this.pathValuesSilently`. The
     * value emitted by this observer removes all keys with `null` or `undefined`
     * values.
     */
    get valueChangesByUser(): Observable<Partial<T>> {
        return this
            .valueChanges
            .pipe(
                filter(() => this.#ready),
                map((x: any) => {
                    Object
                        .entries(x)
                        .forEach(([k, v]) => {
                            if (v == null) {
                                delete x[k];
                            }
                        });

                    return x;
                })
            );
    }

    /**
     * This is a variant of `this.value`, but instead removes
     * all keys with `null` or `undefined` values.
     */
    get partialValue(): Partial<T> {
        const out: any = {};
        Object
            .entries(this.controls)
            .filter(([_, c]) => !c.disabled)
            .forEach(([k, c]) => {
                const v = c.value;
                if (v != null) {
                    out[k] = v;
                }
            });

        return out;
    }

    /**
     * Create a new instance of `StateForm`, equivalent a normal `FormGroup`.
     * @param struct An object with the keys and initial control configuration,
     * exactly the same format using with `FormBuilder`.
     */
    constructor(struct: StateFormStruct<T>) {
        super({});

        // Building each control inside of this form
        Object
            .entries(struct)
            .forEach(([k, v]) => {
                const ctrl = new FormControl(v[0], {
                    validators:         v[1],
                    asyncValidators:    v[2],
                    updateOn:           v[3]
                });

                this.addControl(k, ctrl);
            });
    }

    /**
     * This is a variant of `this.setValue` method, and this should be used in
     * conjunction with `this.valueChangesByUser` observer. This method sets
     * the value of the entire form. The difference is:
     * - Emits the change in `this.valueChanges`.
     * - __Doesn't emits the change__ in `this.valueChangesByUser`.
     * @param v The value to be setted to the whole form.
     */
    setValueSilently(v: { [K in keyof T]: T[K] | null; }): void {
        this.#ready = false;
        this.setValue(v);
        this.#ready = true;
    }

    /**
     * This is a variant of `this.patchValue` method, and this should be used in
     * conjunction with `this.valueChangesByUser` observer. This method sets
     * the value of the entire form. The difference is:
     * - Emits the change in `this.valueChanges`.
     * - __Doesn't emits the change__ in `this.valueChangesByUser`.
     * @param v The name of the controls and their values to be changed.
     */
    patchValueSilently(v: Partial<{ [K in keyof T]: T[K] | null; }>): void {
        this.#ready = false;
        this.patchValue(v);
        this.#ready = true;
    }
}
