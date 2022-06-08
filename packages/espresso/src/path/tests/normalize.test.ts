import test from 'ava';

import { Path } from '../path.js';

test('convert: "hello-world"', t => {
    const path = Path.normalize('hello-world');
    t.is(path, '/hello-world');
});

test('convert: "////// akjsdghskdj "', t => {
    const path = Path.normalize('////// akjsdghskdj ');
    t.is(path, '/akjsdghskdj');
});

test('convert: " locked\\into\\phantasy"', t => {
    const path = Path.normalize(' locked\\into\\phantasy');
    t.is(path, '/locked/into/phantasy');
});