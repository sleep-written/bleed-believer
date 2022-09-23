import type { TestFn } from 'ava';

import "@angular/compiler";
import rawTest from 'ava';
import { Subscription } from 'rxjs';
import { Validators } from '@angular/forms';

import { StateForm } from './state-form.js';

interface FormStruct {
    nick: string;
    pass: string;
}

interface Historical {
    ready: Partial<FormStruct>[];
    all: Partial<FormStruct>[];
}

const test = rawTest as TestFn<{
    form: StateForm<FormStruct>;
    hist: Historical;
    subs: Subscription[];
}>;

test.before(t => {
    const form = new StateForm<FormStruct>({
        nick:   [null, Validators.required],
        pass:   [null, Validators.required],
    });

    const hist: Historical = {
        ready: [],
        all: [],
    };

    const subs = [
        form
            .valueChanges
            .subscribe(() => {
                hist.all.push(form.partialValue);
            }),
        form
            .valueChangesByUser
            .subscribe(v => {
                hist.ready.push(v);
            }),
    ];

    t.context = { form, hist, subs };
});

test.after(t => {
    t.context.subs.forEach(x => x.unsubscribe());
});

test.serial('setValueSilently -> nick: "pendejo"', t => {
    const { form } = t.context;
    form.setValueSilently({
        nick: 'pendejo',
        pass: null
    });

    t.true(form.invalid);
    t.deepEqual(form.partialValue, {
        nick: 'pendejo'
    });
});

test.serial('patchValueSilently -> pass: "jajaja111"', t => {
    const { form } = t.context;
    form.patchValueSilently({
        pass: 'jajaja111'
    });
    
    t.true(form.valid);
    t.deepEqual(form.partialValue, {
        nick: 'pendejo',
        pass: 'jajaja111'
    });
});

test.serial('patchValue -> pass: "nooo"', t => {
    const { form } = t.context;
    form.patchValue({
        pass: 'nooo'
    });
    
    t.true(form.valid);
    t.deepEqual(form.partialValue, {
        nick: 'pendejo',
        pass: 'nooo'
    });
});

test.serial('Check historical values', t => {
    const { hist } = t.context;
    t.deepEqual(hist.all, [
        { nick: 'pendejo' },
        { nick: 'pendejo', pass: 'jajaja111' },
        { nick: 'pendejo', pass: 'nooo' },
    ]);
    
    t.deepEqual(hist.ready, [
        { nick: 'pendejo', pass: 'nooo' },
    ]);
});
