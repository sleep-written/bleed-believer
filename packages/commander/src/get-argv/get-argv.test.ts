import rawTest, { TestFn } from 'ava';
import { Commander } from '../commander.js';
import * as example from './get-argv.example.js';

const test = rawTest as TestFn<{argv: string[]}>;
test.beforeEach(t => {
    t.context = { argv: process.argv.slice() };
    process.argv = t.context.argv.slice(0, 2);
});

test.afterEach(t => {
    process.argv = t.context.argv;
});

//---------------------------------------------------
test.serial('Check Command 01', async t => {
    process.argv.push('hello', 'world');
    const app = new Commander(example.AppRouting);
    await app.initialize();

    t.deepEqual(
        example.tail.get(),
        ['hello', 'world']
    );
});

test.serial('Check Command 02', async t => {
    process.argv.push('cmd02', '--locked', 'true');
    const app = new Commander(example.AppRouting);
    await app.initialize();

    t.deepEqual(
        example.tail.get(),
        {'--locked': ['true']}
    );
});

test.serial('Check Command 03', async t => {
    process.argv.push('cmd03', 'file01.json', 'file02.json');
    const app = new Commander(example.AppRouting);
    await app.initialize();

    t.deepEqual(
        example.tail.get(),
        ['cmd03', 'file01.json', 'file02.json']
    );
});