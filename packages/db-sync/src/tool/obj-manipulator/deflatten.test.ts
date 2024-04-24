import test from 'ava';
import { deflatten } from './deflatten.js';

test('Case 01 (simple object)', t => {
    const out = deflatten([
        { keys: [ 'bar' ], value: 999 },
        { keys: [ 'foo' ], value: 666 },
    ]);

    t.deepEqual(out, {
        foo: 666,
        bar: 999
    });
});

test('Case 02 (simple array)', t => {
    const out = deflatten([
        { keys: [1], value: 'bar' },
        { keys: [0], value: 'foo' },
    ]);

    t.deepEqual(out, [
        'foo',
        'bar'
    ]);
});

test('Case 03 (nested objects)', t => {
    const out = deflatten([
        { keys: ['level1A', 'foo'], value: 666 },
        { keys: ['level1A', 'bar'], value: 999 },
        { keys: ['level1B', 'foo'], value: 111 },
        { keys: ['level1B', 'bar'], value: 222 },
        { keys: ['result'        ], value: new Date(2022, 0, 31) },
    ]);

    t.deepEqual(out, {
        level1A: {
            foo: 666,
            bar: 999,
        },
        level1B: {
            foo: 111,
            bar: 222,
        },
        result: new Date(2022, 0, 31)
    });
});

test('Case 04 (object with array of objects)', t => {
    const out = deflatten([
        { keys: ['level1A', 0, 'foo'],  value: 111 },
        { keys: ['level1A', 0, 'bar'],  value: 222 },
        { keys: ['level1A', 1, 'foo'],  value: 333 },
        { keys: ['level1A', 1, 'bar'],  value: 444 },
        { keys: ['level1B', 0, 'foo'],  value: 555 },
        { keys: ['level1B', 0, 'bar'],  value: 666 },
        { keys: ['level1B', 1, 'foo'],  value: 777 },
        { keys: ['level1B', 1, 'bar'],  value: 888 },
        { keys: ['level1C'],            value: 999 },
    ]);

    t.deepEqual(out, {
        level1A: [
            { foo: 111, bar: 222 },
            { foo: 333, bar: 444 },
        ],
        level1B: [
            { foo: 555, bar: 666 },
            { foo: 777, bar: 888 },
        ],
        level1C: 999
    });
});
