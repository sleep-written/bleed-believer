import rawTest, { TestFn } from 'ava';

import { AppRouting, execTail } from './case02.example.js';
import { Commander } from '../commander.js';

const test = rawTest as TestFn<string[]>;

test.beforeEach(t => {
    t.context = process.argv.slice();
    process.argv = t.context.slice(0, 2);
});

test.afterEach(t => {
    process.argv = t.context.slice();
    t.context = [];

    while (execTail.length) {
        execTail.pop();
    }
});

test.serial('Exec "app api com01"', async t => {
    process.argv.push('app', 'api', 'com01');

    const app = new Commander(AppRouting);
    await app.initialize();
    
    t.deepEqual(execTail, [
        'AppRouting:before',
        'ApiRouting:before',
        'com01',
        'ApiRouting:failed'
    ]);
});

test.serial('Exec "app api com02"', async t => {
    process.argv.push('app', 'api', 'com02');

    const app = new Commander(AppRouting);
    await app.initialize();
    
    t.deepEqual(execTail, [
        'AppRouting:before',
        'ApiRouting:before',
        'com02',
        'ApiRouting:failed'
    ]);
});

test.serial('Exec "app com03"', async t => {
    process.argv.push('app', 'com03');

    const app = new Commander(AppRouting);
    await app.initialize();
    
    t.deepEqual(execTail, [
        'AppRouting:before',
        'com03',
        'AppRouting:failed'
    ]);
});

test.serial('Exec "app com04"', async t => {
    process.argv.push('app', 'com04');

    const app = new Commander(AppRouting);
    await app.initialize();
    
    t.deepEqual(execTail, [
        'AppRouting:before',
        'com04',
        'AppRouting:failed'
    ]);
});