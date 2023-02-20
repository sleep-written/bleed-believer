import type { Subscription } from 'rxjs';
import type { TestFn } from 'ava';
import rawTest from 'ava';

import "@angular/compiler";
import { StateFormArray } from './state-form-array.js';
import { Validators } from '@angular/forms';

interface FormData {
    text?: string;
    value?: number;
}

const test = rawTest as TestFn<{
    subscription: Subscription;
    historical: FormData[][];
    formArray: StateFormArray<FormData>;
}>;

test.before(t => {
    const formArray = new StateFormArray<FormData>({
        text:   [ undefined, Validators.required ],
        value:  [ undefined, Validators.required ],
    });
    
    const historical: FormData[][] = [];
    const subscription = formArray
        .valueChangesByUser
        .subscribe(x => historical.push(x));

    t.context = {
        subscription,
        historical,
        formArray,
    };
});

test.after(t => {
    t.context.subscription.unsubscribe();
});

test.serial('Change data 01', t => {
    t.context.formArray.setValueSilently([
        { text: 'hello',        value: 666 },
        { text: 'world',        value: 999 },
    ]);

    t.pass();
});

test.serial('Change data 02', t => {
    t.context.formArray.setValueSilently([
        { text: 'push', value: 100 },
        { text: 'pull', value: 110 },
        { text: 'kill', value: 111 },
    ]);

    t.pass();
});

test.serial('Create a new form (i = 0)', t => {
    t.context.formArray.createAt(0);
    t.pass();
});

test.serial('Create a new form (i = 1), with custom values', t => {
    t.context.formArray.createAt(1, {
        text: 'jaja',
        value: 0
    });
    t.pass();
});

test.serial('Remove a form (i = 2)', t => {
    t.context.formArray.removeAt(2);
    t.pass();
});

test.serial('Set an empty array', t => {
    t.context.formArray.setValueSilently([]);
    t.context.formArray.updateValueAndValidity();
    t.pass();
});

test.serial('Check historical values', t => {
    const expected = [
        [
            { },                                    //  <- Row inserted
            { text: 'push',         value: 100 },
            { text: 'pull',         value: 110 },
            { text: 'kill',         value: 111 },
        ],
        [
            { },
            { text: 'jaja',         value:   0 },   //  <- Row inserted
            { text: 'push',         value: 100 },
            { text: 'pull',         value: 110 },
            { text: 'kill',         value: 111 },
        ],
        [
            { },
            { text: 'jaja',         value:   0 },
        //  { text: 'push',         value: 100 },       <- Row removed
            { text: 'pull',         value: 110 },
            { text: 'kill',         value: 111 },
        ],
        []
    ];

    t.deepEqual(
        t.context.historical,
        expected,
    );
});
