import { EventEmitter } from './event-emitter.js';
import test from 'ava';

test('Execute 1 "on" callback', async t => {
    const response = await new Promise<string[]>(resolve => {
        const result: string[] = [];
        const emitter = new EventEmitter<[ string ]>();
        emitter.on(msg => result.push(msg));

        emitter.emit('foo');
        emitter.emit('bar');
        emitter.emit('baz');
        resolve(result);
    });

    t.deepEqual(response, [
        'foo',
        'bar',
        'baz'
    ]);
});

test('Execute 1 "on" callback; 1 "once" event callback', async t => {
    type Response = [ string[], string[] ];

    const response = await new Promise<Response>(resolve => {
        const result: Response = [ [], [] ];
        const emitter = new EventEmitter<[ string ]>();
        emitter.once(msg => result[0].push(msg));
        emitter.on(msg => result[1].push(msg));

        emitter.emit('foo');
        emitter.emit('bar');
        emitter.emit('baz');
        resolve(result);
    });

    t.deepEqual(response, [
        [ 'foo' ],
        [ 'foo', 'bar', 'baz' ]
    ]);
});