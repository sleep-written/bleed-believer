import type { Subscription } from 'rxjs';
import type { Person } from './case-01.example.js';
import type { TestFn } from 'ava';

import rawTest from 'ava';

import { PersonState } from './case-01.example.js';

const test = rawTest as TestFn<{
    state: PersonState;
    queue: Person[];
    subsc: Subscription;
}>;
test.before(t => {
    const queue: Person[] = [];
    const state = new PersonState({
        name: 'Pendejo',
        age: 5
    });
    const subsc = state.state.subscribe({
        next: input => queue.push(input)
    });

    t.context = {
        queue,
        state,
        subsc,
    };
});
test.after(t => {
    t.context.subsc.unsubscribe();
});

test.serial('Change age', async t => {
    await t.context.state.changeAge(10);
    t.pass();
});

test.serial('Change name', async t => {
    await t.context.state.changeName('Joder');
    t.pass();
});

test.serial('Change age again', async t => {
    await t.context.state.changeAge(666);
    t.pass();
});

test.serial('Check queue', async t => {
    t.deepEqual(t.context.queue, [
        { name: 'Pendejo',  age:   5 },
        { name: 'Pendejo',  age:  10 },
        { name: 'Joder',    age:  10 },
        { name: 'Joder',    age: 666 },
    ]);
});