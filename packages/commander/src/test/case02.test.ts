import rawTest, { TestFn } from 'ava';

import { AppRouting, mem } from './case02.example.js';
import { Commander } from '../commander.js';

const test = rawTest as TestFn<string[]>;

test.beforeEach(t => {
    t.context = process.argv.slice();
    process.argv = t.context.slice(0, 2);
});

test.afterEach(t => {
    process.argv = t.context.slice();
    t.context = [];

    while (mem.get().length) {
        mem.get().pop();
    }
});

test.serial('Exec "app api com01"', async t => {
    process.argv.push('app', 'api', 'com01');

    const app = new Commander(AppRouting);
    await app.initialize();
    
    t.deepEqual(mem.get(), [
        'AppRouting:before',
        'ApiRouting:before',
        'com01',
        'ApiRouting:failed'
    ]);
    mem.reset();
});

test.serial('Exec "app api com02"', async t => {
    process.argv.push('app', 'api', 'com02');

    const app = new Commander(AppRouting);
    await app.initialize();
    
    t.deepEqual(mem.get(), [
        'AppRouting:before',
        'ApiRouting:before',
        'com02',
        'ApiRouting:failed'
    ]);
    mem.reset();
});

test.serial('Exec "app com03"', async t => {
    process.argv.push('app', 'com03');

    const app = new Commander(AppRouting);
    await app.initialize();
    
    t.deepEqual(mem.get(), [
        'AppRouting:before',
        'com03',
        'AppRouting:failed'
    ]);
    mem.reset();
});

test.serial('Exec "app com04"', async t => {
    process.argv.push('app', 'com04');

    const app = new Commander(AppRouting);
    await app.initialize();
    
    t.deepEqual(mem.get(), [
        'AppRouting:before',
        'com04',
        'AppRouting:failed'
    ]);
    mem.reset();
});