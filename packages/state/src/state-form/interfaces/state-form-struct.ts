import { AsyncValidatorFn, ValidatorFn } from '@angular/forms';
import { StateCtrlValue } from './ctrl-value.js';
import { StateUpdateOn } from './update-on.js';

export type StateFormStruct<T extends Record<string, any>> = {
    [K in keyof T]: [
        StateCtrlValue<T[K]>,

        (ValidatorFn | ValidatorFn[])?,

        (AsyncValidatorFn | AsyncValidatorFn[])?,

        StateUpdateOn?
    ]
}
