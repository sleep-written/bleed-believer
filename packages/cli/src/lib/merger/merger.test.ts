import { Merger } from './merger.js';
import test from 'ava';

test('incoming: undefined; original: 666;', t => {
    const merger = new Merger<number | undefined>();
    const result = merger.merge(undefined, 666);
    t.is(result, 666);
});

test('incoming: 999; original: 666;', t => {
    const merger = new Merger<number | undefined>();
    const result = merger.merge(999, 666);
    t.is(result, 999);
});

test('incoming: {}; original: { id: 666, text: "hola" };', t => {
    interface Data {
        id?:   number;
        text?: string;
    }

    const merger = new Merger<Data>({
        id:   new Merger(),
        text: new Merger()
    });

    const result = merger.merge(
        {},
        { id: 666, text: 'hola' }
    );

    t.deepEqual(result, { id: 666, text: 'hola' });
});

test('incoming: { id: 999 }; original: { id: 666, text: "hola" };', t => {
    interface Data {
        id?:   number;
        text?: string;
    }

    const merger = new Merger<Data>({
        id:   new Merger(),
        text: new Merger()
    });

    const result = merger.merge(
        { id: 999 },
        { id: 666, text: 'hola' }
    );

    t.deepEqual(result, { id: 999, text: 'hola' });
});

test('incoming: { id: 999 }; original: { id: 666, data: [ 5, 6, 7 ] };', t => {
    interface Data {
        id?:   number;
        data?: number[];
    }

    const merger = new Merger<Data>({
        id:   new Merger(),
        data: new Merger((a, b) => [
            ...(a ?? []),
            ...(b ?? []),
        ])
    });

    const result = merger.merge(
        {
            id: 999
        },
        {
            id: 666,
            data: [ 5, 6, 7 ]
        }
    );

    t.deepEqual(result, {
        id: 999,
        data: [ 5, 6, 7 ]
    });
});

test('incoming: { id: 999, data: [ 2, 3, 4 ] }; original: { id: 666, data: [ 5, 6, 7 ] };', t => {
    interface Data {
        id?:   number;
        data?: number[];
    }

    const merger = new Merger<Data>({
        id:   new Merger(),
        data: new Merger((a, b) => [
            ...(a ?? []),
            ...(b ?? [])
        ])
    });

    const result = merger.merge(
        {
            id: 999,
            data: [ 2, 3, 4 ]
        },
        {
            id: 666,
            data: [ 5, 6, 7 ]
        }
    );

    t.deepEqual(result, {
        id: 999,
        data: [ 2, 3, 4, 5, 6, 7 ]
    });
});