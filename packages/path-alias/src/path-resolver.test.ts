import { resolve } from 'path';
import test from 'ava';

import { PathResolver } from './path-resolver.js';

function testResolver(isTsnode: boolean, ...pathParts: string[]): string {
    const resolver = new PathResolver(
        resolve('./dist'),
        resolve('./src'),
        isTsnode
    );

    return resolver.resolve(...pathParts);
}

test('"./entities/pendejo.ts"; isTsNode = true', t => {
    const curr = testResolver(true, './entities/pendejo.ts');
    const spec = resolve('src/entities/pendejo.ts');

    t.is(curr, spec);
});

test('"./entities/pendejo.ts"; isTsNode = false', t => {
    const curr = testResolver(false, './entities/pendejo.ts');
    const spec = resolve('dist/entities/pendejo.js');

    t.is(curr, spec);
});

test('"./entities/pendejo.js"; isTsNode = true', t => {
    const curr = testResolver(true, './entities/pendejo.js');
    const spec = resolve('src/entities/pendejo.ts');

    t.is(curr, spec);
});

test('"./entities/pendejo.js"; isTsNode = false', t => {
    const curr = testResolver(false, './entities/pendejo.js');
    const spec = resolve('dist/entities/pendejo.js');

    t.is(curr, spec);
});

test('"./modules/*.mts"; isTsNode = true', t => {
    const curr = testResolver(true, './modules/*.mts');
    const spec = resolve('src/modules/*.mts');

    t.is(curr, spec);
});

test('"./modules/*.mts"; isTsNode = false', t => {
    const curr = testResolver(false, './modules/*.mts');
    const spec = resolve('dist/modules/*.mjs');

    t.is(curr, spec);
});

test('"./modules/*.mjs"; isTsNode = true', t => {
    const curr = testResolver(true, './modules/*.mjs');
    const spec = resolve('src/modules/*.mts');

    t.is(curr, spec);
});

test('"./modules/*.mjs"; isTsNode = false', t => {
    const curr = testResolver(false, './modules/*.mjs');
    const spec = resolve('dist/modules/*.mjs');

    t.is(curr, spec);
});

test('"./data/*.json"; isTsNode = true', t => {
    const curr = testResolver(true, './data/*.json');
    const spec = resolve('src/data/*.json');

    t.is(curr, spec);
});

test('"./data/*.json"; isTsNode = false', t => {
    const curr = testResolver(false, './data/*.json');
    const spec = resolve('dist/data/*.json');

    t.is(curr, spec);
});
