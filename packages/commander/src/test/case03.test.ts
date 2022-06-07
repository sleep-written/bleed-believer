import rawTest, {TestFn} from 'ava';
import * as case03 from './case03.example.js';

const test = rawTest as TestFn<{argv: string[]}>;
test.beforeEach(t => {
    t.context = { argv: process.argv.slice() };
    process.argv = t.context.argv.slice(0, 2);
});

test.afterEach(t => {
    process.argv = t.context.argv.slice();
});

test.serial('Exec "app mv file-a.json file-b.json"', async t => {
    process.argv.push('app', 'mv', 'file-a.json', 'file-b.json');
    await case03.app.initialize();

    t.deepEqual(case03.mem.get(), [
        'file-a.json',
        'file-b.json'
    ]);
    return;
});

test.serial('Exec "app call aaa bbb ccc"', async t => {
    process.argv.push('app', 'call', 'aaa', 'bbb', 'ccc');
    await case03.app.initialize();

    t.deepEqual(case03.mem.get(), [
        'aaa',
        'bbb',
        'ccc',
    ]);
    return;
});
