import type { AbstractControlOptions } from '@angular/forms';
import type { StateFormStruct } from '../state-form-group/index.js';

import { filter, Observable, map } from 'rxjs';
import { StateFormGroup } from '../state-form-group/index.js';
import { FormArray } from '@angular/forms';

export class StateFormArray<T extends Record<string, any>> extends FormArray<StateFormGroup<StateFormStruct<T>>> {
    #struct: StateFormStruct<T>;
    #ready = true;

    /**
     * This is a variant of `this.valueChanges`, but this observer ignores all
     * calls from `this.setValueSilently` and `this.pathValuesSilently`. The
     * value emitted by this observer removes all keys with `null` or `undefined`
     * values.
     */
    get valueChangesByUser(): Observable<Partial<T>[]> {
        return this
            .valueChanges
            .pipe(
                filter(() => this.#ready),
                map((data: any[]) => {
                    return data.map(x => {
                        Object
                            .entries(x)
                            .forEach(([k, v]) => {
                                if (v == null) {
                                    delete x[k];
                                }
                            });
    
                        return x;
                    });
                })
            );
    }

    constructor(struct: StateFormStruct<T>, options?: AbstractControlOptions) {
        super([], options);
        this.#struct = struct;
    }

    #resizeArray(length: number): void {
        // Remove forms
        if (length < this.length) {
            this.controls.splice(length);
        }

        // Add new rows
        while (this.length < length) {
            this.push(new StateFormGroup(this.#struct));
        }

    }

    /**
     * This is a variant of `this.setValue` method, and this should be used in
     * conjunction with `this.valueChangesByUser` observer. This method sets
     * the value of the entire form. The difference is:
     * - Emits the change in `this.valueChanges`.
     * - __Doesn't emits the change__ in `this.valueChangesByUser`.
     * @param data The array with the data to be setted to the whole form.
     */
    setValueSilently(data: { [K in keyof T]: T[K] | null; }[]): void {
        // Lock the form
        if (!this.#ready) { return; }
        this.#ready = false;

        this.#resizeArray(data.length);
        this.setValue(data);

        // Reactivate the form
        this.#ready = true;
    }

    /**
     * This is a variant of `this.patchValue` method, and this should be used in
     * conjunction with `this.valueChangesByUser` observer. This method sets
     * the value of the entire form. The difference is:
     * - Emits the change in `this.valueChanges`.
     * - __Doesn't emits the change__ in `this.valueChangesByUser`.
     * @param data The array with the data of the controls and their values to be changed.
     */
    patchValueSilently(data: { [K in keyof T]: T[K] | null; }[]): void {
        // Lock the form
        if (!this.#ready) { return; }
        this.#ready = false;

        this.#resizeArray(data.length);
        this.patchValue(data);

        // Reactivate the form
        this.#ready = true;
    }

    /**
     * Adds a new `StateFormGroup` at the specified index.
     * @param index Index in the array to insert the control. If `index` is negative, wraps around
     * from the back. If `index` is greatly negative (less than `-length`), prepends to the array.
     * This behavior is the same as `Array.splice(index, 0, control)`.
     * @param item The values of the new `StateFormGroup` instance to insert.
     */
    createAt(index: number, item?: { [K in keyof T]: T[K] | null; }): void {
        const form = new StateFormGroup(this.#struct);

        if (item) {
            form.setValueSilently(item);
        }

        this.insert(index, form);
    }
}
