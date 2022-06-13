import test from 'ava';
import { resolve } from 'path';

import { Tsconfig } from './tsconfig.js';

test('Get Aliases "tsconfig.01.json" (production)', t => {
    const tsconfig = new Tsconfig('./tsconfig-tests/tsconfig.01.json');
    const alias = tsconfig.getAliases();

    t.deepEqual(alias, [
        { alias: '@models', path: resolve('./dist/models') },
        { alias: '@tool', path: resolve('./dist/tool') },
    ]);
});

test('Get Aliases "tsconfig.01.json" (ts-node)', t => {
    const tsconfig = new Tsconfig('./tsconfig-tests/tsconfig.01.json');
    const alias = tsconfig.getAliases(true);

    t.deepEqual(alias, [
        { alias: '@models', path: resolve('./src/models') },
        { alias: '@tool', path: resolve('./src/tool') },
    ]);
});
