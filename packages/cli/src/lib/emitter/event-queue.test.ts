import { EventQueue } from './event-queue.js';
import test from 'ava';

test('Execute 1 "on" async callback', async t => {
    const response = await new Promise<string[]>(async resolve => {
        const result: string[] = [];
        const queue = new EventQueue<[ string ]>();
        queue.on(async msg => {
            result.push(msg);
            await new Promise(r => setTimeout(r, 1_000));
        });

        await queue.emit('foo');
        await queue.emit('bar');
        await queue.emit('baz');
        resolve(result);
    });

    t.deepEqual(response, [
        'foo',
        'bar',
        'baz'
    ]);
});

test('Execute 1 "on" async callback; 1 "once" async callback', async t => {
    const response = await new Promise<[ string[], string[] ]>(async resolve => {
        const result: [ string[], string[] ] = [ [], [] ];
        const queue = new EventQueue<[ string ]>();
        queue.once(async msg => {
            result[0].push(msg);
            await new Promise(r => setTimeout(r, 1_000));
        });

        queue.on(async msg => {
            result[1].push(msg);
            await new Promise(r => setTimeout(r, 1_000));
        });

        await queue.emit('foo');
        await queue.emit('bar');
        await queue.emit('baz');
        resolve(result);
    });

    t.deepEqual(response, [
        [ 'foo' ],
        [ 'foo', 'bar', 'baz' ]
    ]);
});