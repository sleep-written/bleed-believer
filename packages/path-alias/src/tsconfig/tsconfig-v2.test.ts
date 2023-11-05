import { join, resolve } from 'path';
import test from 'ava';

import { Tsconfig } from './tsconfig.js';

test('Read case-01: All parameters declared', t => {
    const basePath = resolve('./tsconfig-tests/case-01');
    const tsconfig = new Tsconfig(join(basePath, './tsconfig.json'));
    const data = tsconfig.getOptions();

    t.is(data.outDir,   join(basePath, './dist'));
    t.is(data.rootDir,  join(basePath, './src'));
    t.is(data.baseUrl,  join(basePath, './src'));
    t.deepEqual(data.paths, {
        '@entities/*':  ['./entities/*'],
        '@tool/*':      ['./tool/*']
    });
});

test('Read case-02: outDir, rootDir and baseUrl not declared; paths declared', t => {
    const basePath = resolve('./tsconfig-tests/case-02');
    const tsconfig = new Tsconfig(join(basePath, './tsconfig.json'));
    const data = tsconfig.getOptions();

    t.is(data.outDir,   basePath);
    t.is(data.rootDir,  basePath);
    t.is(data.baseUrl,  basePath);
    t.deepEqual(data.paths, {
        '@entities/*':  ['./entities/*'],
        '@tool/*':      ['./tool/*']
    });
});

test(
        'Read case-03 [monorepo example]: outDir and rootDir in "./packages/dummy"; '
    +   'baseUrl and paths aren\'t declared',
t => {
    const basePath = resolve('./tsconfig-tests/case-03/packages/dummy');
    const tsconfig = new Tsconfig(join(basePath, './tsconfig.json'));
    const data = tsconfig.getOptions();

    t.is(data.outDir,   join(basePath, './dist'));
    t.is(data.rootDir,  join(basePath, './src'));
    t.is(data.baseUrl,  join(basePath, './src'));
    t.deepEqual(data.paths, { });
});

test(
        'Read case-04 [monorepo example]: outDir and rootDir in "."; '
    +   'baseUrl and paths are\'t declared',
t => {
    const basePath = resolve('./tsconfig-tests/case-04');
    const tsconfig = new Tsconfig(join(basePath, './packages/dummy/tsconfig.json'));
    const data = tsconfig.getOptions();

    t.is(data.outDir,   join(basePath, './dist'));
    t.is(data.rootDir,  join(basePath, './src'));
    t.is(data.baseUrl,  join(basePath, './src'));
    t.deepEqual(data.paths, { });
});

test(
        'Read case-05 [monorepo example]: outDir, rootDir, baseUrl and '
    +   'paths in "./packages/dummy"; extends as string',
t => {
    const basePath = resolve('./tsconfig-tests/case-05/packages/dummy');
    const tsconfig = new Tsconfig(join(basePath, './tsconfig.json'));
    const data = tsconfig.getOptions();

    t.is(data.outDir,   join(basePath, './dist'));
    t.is(data.rootDir,  join(basePath, './src'));
    t.is(data.baseUrl,  join(basePath, './src'));
    t.deepEqual(data.paths, {
        '@entities/*':  ['./entities/*'],
        '@tool/*':      ['./tool/*']
    });
});

test(
        'Read case-06 [monorepo example]: outDir and rootDir at "./packages/dummy"; '
    +   'baseUrl and paths at "."; extends as string',
t => {
    const basePath = resolve('./tsconfig-tests/case-06');
    const tsconfig = new Tsconfig(join(basePath, './packages/dummy/tsconfig.json'));
    const data = tsconfig.getOptions();

    t.is(data.outDir,   join(basePath, './packages/dummy/dist'));
    t.is(data.rootDir,  join(basePath, './packages/dummy/src'));
    t.is(data.baseUrl,  join(basePath, './src'));
    t.deepEqual(data.paths, {
        '@entities/*':  ['./entities/*'],
        '@tool/*':      ['./tool/*']
    });
});

test(
        'Read case-07 [monorepo example]: rootDir, outDir and baseUrl at "./packages/dummy"; '
    +   'paths at "."; extends as string',
t => {
    const basePath = resolve('./tsconfig-tests/case-07/packages/dummy');
    const tsconfig = new Tsconfig(join(basePath, './tsconfig.json'));
    const data = tsconfig.getOptions();

    t.is(data.outDir,   join(basePath, './dist'));
    t.is(data.rootDir,  join(basePath, './src'));
    t.is(data.baseUrl,  join(basePath, './src'));
    t.deepEqual(data.paths, {
        '@entities/*':  ['./entities/*'],
        '@tool/*':      ['./tool/*']
    });
});

test(
        'Read case-08 [monorepo example]: rootDir and outDir at "./packages/dummy"; '
    +   'baseUrl and paths at "."; extends as string',
t => {
    const basePath = resolve('./tsconfig-tests/case-08/packages/dummy');
    const tsconfig = new Tsconfig(join(basePath, './tsconfig.json'));
    const data = tsconfig.getOptions();

    t.is(data.outDir,   join(basePath, './dist'));
    t.is(data.rootDir,  join(basePath, './src'));
    t.is(data.baseUrl,  join(basePath, '../../src'));
    t.deepEqual(data.paths, {
        '@entities/*':  ['./entities/*'],
        '@tool/*':      ['./tool/*']
    });
});

test(
        'Read case-09 [monorepo example]: rootDir and outDir at "./packages/dummy";'
    +   'baseUrl not declared; paths at "."; extends as string',
t => {
    const basePath = resolve('./tsconfig-tests/case-09/packages/dummy');
    const tsconfig = new Tsconfig(join(basePath, './tsconfig.json'));
    const data = tsconfig.getOptions();

    t.is(data.outDir,   join(basePath, './dist'));
    t.is(data.rootDir,  join(basePath, './src'));
    t.is(data.baseUrl,  join(basePath, './src'));
    t.deepEqual(data.paths, {
        '@entities/*':  ['./entities/*'],
        '@tool/*':      ['./tool/*']
    });
});

test(
        'Read case-10 [monorepo example]: outDir at "."; '
    +   'rootDir at "./packages"; '
    +   'baseUrl at "./packages/dummy"; '
    +   'extends as string[]',
t => {
    const basePath = resolve('./tsconfig-tests/case-10');
    const tsconfig = new Tsconfig(join(basePath, './packages/dummy/tsconfig.json'));
    const data = tsconfig.getOptions();

    t.is(data.outDir,   join(basePath, './dist'));
    t.is(data.rootDir,  join(basePath, './packages/src'));
    t.is(data.baseUrl,  join(basePath, './packages/dummy/src'));
    t.deepEqual(data.paths, {
        '@entities/*':  ['./entities/*'],
        '@tool/*':      ['./tool/*']
    });
});