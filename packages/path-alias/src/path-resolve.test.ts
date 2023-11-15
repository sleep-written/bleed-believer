import test from 'ava';
import { resolve } from 'path';

import { pathResolve } from './path-resolve.js';

function setEnv(value: string | null): void {
    if (value == null) {
        delete (process.env as any).RESOLVE_SRC;
    } else {
        (process.env as any).RESOLVE_SRC = value;
    }
}

test.serial('RESOLVE_SRC=true', t => {
    setEnv('true');
    const res = pathResolve('path/to/file.js');
    t.is(res, resolve('src/path/to/file.js'));
});

test.serial('RESOLVE_SRC=false', t => {
    setEnv('false');
    const res = pathResolve('path/to/file.js');
    t.is(res, resolve('dist/path/to/file.js'));
});