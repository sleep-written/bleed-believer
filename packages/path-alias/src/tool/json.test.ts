import test from 'ava';

import { Json } from './json.js';

test('Read tsconfig.json (async)', async t => {
    const file = new Json('./tsconfig.json');
    const json = await file.load();

    t.deepEqual(json, {
        'extends': '../../tsconfig.json',
        'compilerOptions': {
            'module': 'ES2022',
    
            'rootDir': './src',
            'outDir': './dist/esm'
        }
    })
});

test('Read tsconfig.json', t => {
    const file = new Json('./tsconfig.json');
    const json = file.loadSync();

    t.deepEqual(json, {
        'extends': '../../tsconfig.json',
        'compilerOptions': {
            'module': 'ES2022',
    
            'rootDir': './src',
            'outDir': './dist/esm'
        }
    })
});