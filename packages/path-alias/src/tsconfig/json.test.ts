import test from 'ava';

import { Json } from './json.js';

test('Read tsconfig.json (async)', async t => {
    const file = new Json('./tsconfig.json');
    const json = await file.load();

    t.is(json.extends, '../../tsconfig.json');
    t.is(json.compilerOptions?.rootDir, './src');
    t.is(json.compilerOptions?.outDir, './dist');
});

test('Read tsconfig.json', t => {
    const file = new Json('./tsconfig.json');
    const json = file.loadSync();

    t.is(json.extends, '../../tsconfig.json');
    t.is(json.compilerOptions?.rootDir, './src');
    t.is(json.compilerOptions?.outDir, './dist');
});