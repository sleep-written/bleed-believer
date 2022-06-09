import test from 'ava';

import { Commander, commanderReset } from '../commander/index.js';
import * as example from './get-argv.example.js';

//---------------------------------------------------
test.serial('Check Command 01', async t => {
    commanderReset(['hello', 'world']);
    const app = new Commander(example.AppRouting);
    await app.execute();

    t.deepEqual(
        example.tail.get(),
        ['hello', 'world']
    );
});

test.serial('Check Command 02', async t => {
    commanderReset(['cmd02', '--locked', 'true']);
    const app = new Commander(example.AppRouting);
    await app.execute();

    t.deepEqual(
        example.tail.get(),
        {'--locked': ['true']}
    );
});

test.serial('Check Command 03', async t => {
    commanderReset(['cmd03', 'file01.json', 'file02.json']);
    const app = new Commander(example.AppRouting);
    await app.execute();

    t.deepEqual(
        example.tail.get(),
        ['cmd03', 'file01.json', 'file02.json']
    );
});