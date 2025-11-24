import type { PathAliasInject } from './interfaces/index.js';

import { PathAlias } from './path-alias.js';
import { TSConfig } from '@lib/ts-config/index.js';
import test from 'ava';

const tsConfig = new TSConfig({
    compilerOptions: {
        baseUrl: 'src',
        paths: {
            '@data-source':  [ 'data-source.ts' ],
            '@builders': [
                'mysql-builder.ts',
                'mssql-builder.ts',
            ],

            '@tool/*': [ 'tool/*' ],
            '@lib/*': [
                './lib/*',
                './lib-alt-1/*',
                './lib-alt-2/*',
            ]
        }
    }
});

const inject: PathAliasInject = {
    process: { cwd: () => '/path/to/project' }
};

test('Single file alias', t => {
    const pathAlias = new PathAlias(tsConfig, inject);
    const result = pathAlias.find('@data-source');
    t.deepEqual(result, [
        '/path/to/project/src/data-source.ts'
    ]);
});

test('Multiple file aliases', t => {
    const pathAlias = new PathAlias(tsConfig, inject);
    const result = pathAlias.find('@builders');
    t.deepEqual(result, [
        '/path/to/project/src/mysql-builder.ts',
        '/path/to/project/src/mssql-builder.ts',
    ]);
});

test('Single path alias', t => {
    const pathAlias = new PathAlias(tsConfig, inject);
    const result = pathAlias.find('@tool/pendejo.ts');
    t.deepEqual(result, [
        '/path/to/project/src/tool/pendejo.ts'
    ]);
});

test('Multiple path aliases', t => {
    const pathAlias = new PathAlias(tsConfig, inject);
    const result = pathAlias.find('@lib/pendejo.ts');
    t.deepEqual(result, [
        '/path/to/project/src/lib/pendejo.ts',
        '/path/to/project/src/lib-alt-1/pendejo.ts',
        '/path/to/project/src/lib-alt-2/pendejo.ts',
    ]);
});