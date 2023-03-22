import test from 'ava';
import { resolve } from 'path';

import { Tsconfig } from './tsconfig.js';

test('Get Aliases "tsconfig.01.json"', t => {
    const tsconfig = new Tsconfig('./tsconfig-tests/tsconfig.01.json');
    const opts = tsconfig.getOptions();

    t.is(opts.baseUrl, resolve('./src'));
    t.is(opts.rootDir, resolve('./src'));
    t.is(opts.outDir, resolve('./dist'));
    t.deepEqual(opts.paths, {
        '@models/*': ['./models/*'],
        '@tool/*': ['./tool/*'],
    });
});

test('Get Aliases "tsconfig.02.json"', t => {
    const tsconfig = new Tsconfig('./tsconfig-tests/tsconfig.02.json');
    const opts = tsconfig.getOptions();

    t.is(opts.baseUrl, resolve('./src'));
    t.is(opts.rootDir, resolve('./src'));
    t.is(opts.outDir, resolve('./dist'));
    t.deepEqual(opts.paths, {
        '@models/*': ['./models/*'],
        '@tool/*': ['./tool/*'],
    });
});

test('Get Aliases "tsconfig.03.json"', t => {
    const tsconfig = new Tsconfig('./tsconfig-tests/tsconfig.03.json');
    const opts = tsconfig.getOptions();

    t.is(opts.baseUrl, resolve('./src'));
    t.is(opts.rootDir, resolve('./src'));
    t.is(opts.outDir, resolve('./dist'));
    t.deepEqual(opts.paths, {
        '@models/*': ['./models/*'],
        '@tool/*': ['./tool/*'],
    });
});

test.only('Get Aliases "tsconfig.04.json"', t => {
    const tsconfig = new Tsconfig('./tsconfig-tests/tsconfig.04.json');
    const opts = tsconfig.getOptions();

    t.is(opts.baseUrl, resolve('./src'));
    t.is(opts.rootDir, resolve('./src'));
    t.is(opts.outDir, resolve('./dist'));
    t.deepEqual(opts.paths, {
        '@command-a': [ './command-a/*' ],
        '@command-b': [ './command-b/*' ],
        '@command-c': [ './command-c/*' ]
    });
});