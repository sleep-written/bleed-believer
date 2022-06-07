import rawTest, { TestFn } from 'ava';

import { AppRouting, mem } from './case01.example.js';
import { Commander } from '../commander.js';

const test = rawTest as TestFn<{argv: string[]}>;

test.serial.beforeEach(t => {
    t.context = { argv: process.argv.slice() };
    process.argv = t.context.argv.slice(0, 2);
});

test.serial.afterEach(t => {
    process.argv = t.context.argv.slice();
});

test.serial('Exec "app api com01"', async t => {
    process.argv.push('app', 'api', 'com01');

    const app = new Commander(AppRouting);
    await app.initialize();
    
    t.deepEqual(mem.get(), [
        'AppRouting:before',
        'ApiRouting:before',
        'com01',
        'ApiRouting:after',
        'AppRouting:after'
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
        'ApiRouting:after',
        'AppRouting:after'
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
        'AppRouting:after'
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
        'AppRouting:after'
    ]);
    mem.reset();
});