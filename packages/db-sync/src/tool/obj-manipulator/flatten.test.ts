import test from 'ava';
import { flatten } from './flatten.js';

test('Case 01 (simple object)', t => {
    const out = flatten({
        text: 'jajaja',
        value: 666
    });

    t.deepEqual(out, [
        { keys: ['text' ],  value: 'jajaja' },
        { keys: ['value'],  value: 666 }
    ]);
});

test('Case 02 (complex object)', t => {
    const out = flatten({
        level1A: {
            text: 'jajaja',
            value: 666
        },
        loops: 32
    });

    t.deepEqual(out, [
        { keys: ['level1A', 'text'],    value: 'jajaja' },
        { keys: ['level1A', 'value'],   value: 666 },
        { keys: ['loops'],              value: 32 }
    ]);
});

test('Case 03 (array)', t => {
    const out = flatten([
        'joder',
        'chaval'
    ]);

    t.deepEqual(out, [
        { keys: [0], value: 'joder' },
        { keys: [1], value: 'chaval' }
    ]);
});

test('Case 04 (an object with arrays inside)', t => {
    const out = flatten({
        level1A: ['foo', 'bar'],
        level1B: ['xxx', 'yyy'],
    });

    t.deepEqual(out, [
        { keys: ['level1A', 0], value: 'foo' },
        { keys: ['level1A', 1], value: 'bar' },
        { keys: ['level1B', 0], value: 'xxx' },
        { keys: ['level1B', 1], value: 'yyy' },
    ]);
});

test('Case 05 (an array with objects inside)', t => {
    const out = flatten([
        { text: 'jajaja', value: 666 },
        { text: 'gegege', value: 999 }
    ]);

    t.deepEqual(out, [
        { keys: [0, 'text' ], value: 'jajaja' },
        { keys: [0, 'value'], value: 666 },
        { keys: [1, 'text' ], value: 'gegege' },
        { keys: [1, 'value'], value: 999 },
    ]);
});

test('Case 06 (an object with an array of objects inside)', t => {
    const out = flatten({
        corr: 666,
        date: new Date(2022, 0, 1),
        details: [
            { cod: 'AAA', cant: 1 },
            { cod: 'ZZZ', cant: 9 },
        ]
    });

    t.deepEqual(out, [
        { keys: ['corr'], value: 666 },
        { keys: ['date'], value: new Date(2022, 0, 1) },
        { keys: ['details', 0, 'cod' ], value: 'AAA' },
        { keys: ['details', 0, 'cant'], value: 1 },
        { keys: ['details', 1, 'cod' ], value: 'ZZZ' },
        { keys: ['details', 1, 'cant'], value: 9 },
    ]);
});
