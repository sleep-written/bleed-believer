import test from 'ava';

import { Commander, commanderReset } from '../commander/index.js';
import * as example from './get-argv-data.example.js';

test.serial('Check Command 01', async t => {
    commanderReset(['cmd01', 'file01.json', 'file02.json']);
    const app = new Commander(example.AppRouting);
    await app.execute();

    t.deepEqual(
        example.tail.get(),
        {
            file01: 'file01.json',
            file02: 'file02.json',
        }
    );
});

test.serial('Check Command 02', async t => {
    commanderReset(['cmd02', 'file01.json', 'file02.json']);
    const app = new Commander(example.AppRouting);
    await app.execute();

    t.deepEqual(
        example.tail.get(),
        [
            'file01.json',
            'file02.json',
        ]
    );
});
