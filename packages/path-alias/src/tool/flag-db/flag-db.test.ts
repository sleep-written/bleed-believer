import { FlagDB } from './flag-db.js';
import { join } from 'path';
import { rm } from 'fs/promises';
import test from 'ava';

const flagDB = new FlagDB(
    join(process.cwd(), 'flags.db'),
    'isTsNode', 'isTesting', 'isFree', 'isDeleted'
);

test.afterEach(async () => {
    await rm(flagDB.path, { force: true });
});

test.serial('Write case 01', async t => {
    await flagDB.set({
        isTsNode: false,
        isTesting: false,
        isFree: false,
        isDeleted: false,
    });

    const value = await flagDB.get();
    t.deepEqual(value, {
        isTsNode: false,
        isTesting: false,
        isFree: false,
        isDeleted: false,
    });
});

test.serial('Write case 02', async t => {
    await flagDB.set({
        isTsNode: true,
        isTesting: false,
        isFree: false,
        isDeleted: false,
    });

    const value = await flagDB.get();
    t.deepEqual(value, {
        isTsNode: true,
        isTesting: false,
        isFree: false,
        isDeleted: false,
    });
});

test.serial('Write case 03', async t => {
    await flagDB.set({
        isTsNode: true,
        isTesting: true,
        isFree: false,
        isDeleted: false,
    });

    const value = await flagDB.get();
    t.deepEqual(value, {
        isTsNode: true,
        isTesting: true,
        isFree: false,
        isDeleted: false,
    });
});

test.only('Write case 04', async t => {
    await flagDB.set({
        isTsNode: false,
        isTesting: false,
        isFree: false,
        isDeleted: true,
    });

    const value = await flagDB.get();
    t.deepEqual(value, {
        isTsNode: false,
        isTesting: false,
        isFree: false,
        isDeleted: true,
    });
});
