import test from 'ava';

import { getCompilerOptions } from './get-compiler-options.js';

test('Read "tsconfig.01.json"', t => {
    const options = getCompilerOptions('./tsconfig-tests/tsconfig.01.json', {});

    t.deepEqual(options, {
        'rootDir': 'src',
        'outDir': 'dist',
        'baseUrl': 'src',
        'paths': {
            '@models/*': ['./models/*'],
            '@tool/*': ['./tool/*']
        }
    });
});

test('Read "tsconfig.02.json"', t => {
    const options = getCompilerOptions('./tsconfig-tests/tsconfig.02.json', {});

    t.deepEqual(options, {
        'rootDir': 'src',
        'outDir': 'dist',
        'baseUrl': 'src',
        'paths': {
            '@models/*': ['./models/*'],
            '@tool/*': ['./tool/*']
        }
    });
});

test('Read "tsconfig.03.json"', t => {
    const options = getCompilerOptions('./tsconfig-tests/tsconfig.03.json', {});

    t.deepEqual(options, {
        'rootDir': 'src',
        'outDir': 'dist',
        'baseUrl': 'src',
        'paths': {
            '@models/*': ['./models/*'],
            '@tool/*': ['./tool/*']
        }
    });
});