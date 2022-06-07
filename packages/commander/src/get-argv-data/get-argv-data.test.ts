import rawTest, { TestFn } from 'ava';
import { Commander } from '../commander.js';
import * as example from './get-argv-data.example.js';

const test = rawTest as TestFn<{argv: string[]}>;
test.beforeEach(t => {
    t.context = { argv: process.argv.slice() };
    process.argv = t.context.argv.slice(0, 2);
});

test.afterEach(t => {
    process.argv = t.context.argv;
});

//---------------------------------------------------------
test.serial('Check Command 01', async t => {
    process.argv.push('cmd01', 'file01.json', 'file02.json');
    const app = new Commander(example.AppRouting);
    await app.initialize();

    t.deepEqual(
        example.tail.get(),
        {
            file01: 'file01.json',
            file02: 'file02.json',
        }
    );
});

test.serial('Check Command 02', async t => {
    process.argv.push('cmd02', 'file01.json', 'file02.json');
    const app = new Commander(example.AppRouting);
    await app.initialize();

    t.deepEqual(
        example.tail.get(),
        [
            'file01.json',
            'file02.json',
        ]
    );
});
