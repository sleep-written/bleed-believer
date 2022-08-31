import { filter, Observable, map } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { StateFormStruct } from './interfaces/index.js';

export class StateForm<T extends Record<string, any>> extends FormGroup {
    #ready = true;
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

    setValueSilently(v: { [K in keyof T]: T[K] | null; }): void {
        this.#ready = false;
        this.setValue(v);
        this.#ready = true;
    }

    patchValueSilently(v: Partial<{ [K in keyof T]: T[K] | null; }>): void {
        this.#ready = false;
        this.patchValue(v);
        this.#ready = true;
    }
}
