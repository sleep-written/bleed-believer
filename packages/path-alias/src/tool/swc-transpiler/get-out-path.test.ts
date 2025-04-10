import type { TsConfigResult } from 'get-tsconfig';

import { getOutPath } from './get-out-path.js';
import test from 'ava';
import { normalize } from 'path';

test('"./bombardino/crocodrillo.ts" → "./bombardino/crocodrillo.js"', t => {
    // Weld
    const tsConfigResult: TsConfigResult = {
        path: '/tralalero/tralala/tsconfig.json',
        config: {}
    };

    // When
    const path = getOutPath('/tralalero/tralala/bombardino/crocodrillo.ts', tsConfigResult);

    // Then
    t.is(path, normalize('/tralalero/tralala/bombardino/crocodrillo.js'));
});

test('"./src/index.mts" → "./dist/index.mjs"', t => {
    // Weld
    const tsConfigResult: TsConfigResult = {
        path: '/tralalero/tralala/tsconfig.json',
        config: {
            compilerOptions: {
                outDir: 'dist',
                rootDir: 'src'
            }
        }
    };

    // When
    const path = getOutPath('/tralalero/tralala/src/index.mts', tsConfigResult);

    // Then
    t.is(path, normalize('/tralalero/tralala/dist/index.mjs'));
});

test('"./example/tool/7empest.cts" → ""./dist/example/tool/7empest.cjs"', t => {
    // Weld
    const tsConfigResult: TsConfigResult = {
        path: '/tralalero/tralala/tsconfig.json',
        config: {
            compilerOptions: {
                outDir: 'dist',
                rootDirs: [ 'src', 'example' ]
            }
        }
    };

    // When
    const path = getOutPath('/tralalero/tralala/example/tool/7empest.cts', tsConfigResult);

    // Then
    t.is(path, normalize('/tralalero/tralala/dist/example/tool/7empest.cjs'));
});
