import type { AsyncValidatorFn, ValidatorFn } from '@angular/forms';
import type { StateCtrlValue } from './ctrl-value.js';
import type { StateUpdateOn } from './update-on.js';

export type StateFormStruct<T extends Record<string, any>> = {
    [K in keyof T]: [
        StateCtrlValue<T[K]>,

        (ValidatorFn | ValidatorFn[])?,

        (AsyncValidatorFn | AsyncValidatorFn[])?,

        StateUpdateOn?
    ]
}
