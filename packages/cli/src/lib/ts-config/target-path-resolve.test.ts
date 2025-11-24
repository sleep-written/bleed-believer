import type { TSConfigLoadInject } from './interfaces/index.js';

import { targetPathResolve } from './target-path-resolve.js';
import test from 'ava';

const inject: TSConfigLoadInject = {
    process: {
        cwd: () => '/path/to/project'
    }
};

test('Test null → "/path/to/project/tsconfig.json"', t => {
    const result = targetPathResolve(null, inject);
    t.is(result, '/path/to/project/tsconfig.json');
});

test('Test "" → "/path/to/project/tsconfig.json"', t => {
    const result = targetPathResolve('', inject);
    t.is(result, '/path/to/project/tsconfig.json');
});

test('Test "perreoijoeputa.json" → "/path/to/project/perreoijoeputa.json"', t => {
    const result = targetPathResolve('perreoijoeputa.json', inject);
    t.is(result, '/path/to/project/perreoijoeputa.json');
});

test('Test ".." → "/path/to/tsconfig.json"', t => {
    const result = targetPathResolve('..', inject);
    t.is(result, '/path/to/tsconfig.json');
});

test('Test "../perreoijoeputa.json" → "/path/to/perreoijoeputa.json"', t => {
    const result = targetPathResolve('../perreoijoeputa.json', inject);
    t.is(result, '/path/to/perreoijoeputa.json');
});