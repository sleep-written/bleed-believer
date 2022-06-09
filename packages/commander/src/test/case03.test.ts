import test from 'ava';

import { Commander, commanderReset } from '../commander/index.js';
import * as case03 from './case03.example.js';

test.serial('Exec "app mv file-a.json file-b.json"', async t => {
    commanderReset(['app', 'mv', 'file-a.json', 'file-b.json']);
    process.argv.push();
    const app = new Commander(case03.AppRouting);
    await app.execute();

    t.deepEqual(case03.mem.get(), [
        'file-a.json',
        'file-b.json'
    ]);
    return;
});

test.serial('Exec "app call aaa bbb ccc"', async t => {
    commanderReset(['app', 'call', 'aaa', 'bbb', 'ccc']);
    process.argv.push();
    const app = new Commander(case03.AppRouting);
    await app.execute();

    t.deepEqual(case03.mem.get(), [
        'aaa',
        'bbb',
        'ccc',
    ]);
    return;
});
