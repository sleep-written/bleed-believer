import test from 'ava';

import { Commander, commanderReset } from '../commander/index.js';
import { AppRouting, mem } from './case02.example.js';

test.serial('Exec "app api com01"', async t => {
    commanderReset(['app', 'api', 'com01']);
    const app = new Commander(AppRouting);
    await app.execute();
    
    t.deepEqual(mem.get(), [
        'AppRouting:before',
        'ApiRouting:before',
        'com01',
        'ApiRouting:failed'
    ]);
    mem.reset();
});

test.serial('Exec "app api com02"', async t => {
    commanderReset(['app', 'api', 'com02'])
    const app = new Commander(AppRouting);
    await app.execute();
    
    t.deepEqual(mem.get(), [
        'AppRouting:before',
        'ApiRouting:before',
        'com02',
        'ApiRouting:failed'
    ]);
    mem.reset();
});

test.serial('Exec "app com03"', async t => {
    commanderReset(['app', 'com03'])
    const app = new Commander(AppRouting);
    await app.execute();
    
    t.deepEqual(mem.get(), [
        'AppRouting:before',
        'com03',
        'AppRouting:failed'
    ]);
    mem.reset();
});

test.serial('Exec "app com04"', async t => {
    commanderReset(['app', 'com04'])
    const app = new Commander(AppRouting);
    await app.execute();
    
    t.deepEqual(mem.get(), [
        'AppRouting:before',
        'com04',
        'AppRouting:failed'
    ]);
    mem.reset();
});