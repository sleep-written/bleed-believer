import test from 'ava';
import { isFileExists } from './is-file-exists.js';
import { resolve } from 'path';

test('Check "./package.json" = true', async t => {
    const path = resolve(process.cwd(), './package.json');
    const exists = await isFileExists(path);
    t.true(exists);
});

test('Check "./ñeeeeeeeeeee" = false', async t => {
    const path = resolve(process.cwd(), './ñeeeeeeeeeee');
    const exists = await isFileExists(path);
    t.false(exists);
});
