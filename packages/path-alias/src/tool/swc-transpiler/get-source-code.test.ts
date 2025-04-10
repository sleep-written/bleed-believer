import { getSourceCodeMock } from './get-source-code.mock.js';
import { getSourceCode } from './get-source-code.js';
import test from 'ava';
import { normalize } from 'path';

test('Get files from "./src"', async t => {
    // Weld
    const { tsConfigResult, injector } = getSourceCodeMock({
        path: '/tralalero/tralala/tsconfig.json',
        config: {
            compilerOptions: {
                outDir: 'dist',
                rootDir: 'src'
            }
        },
        platform: 'linux',
        files: [
            './src/index.ts',
            './src/tool/7empest/index.ts',
            './src/tool/7empest/7empest.ts',
            './src/tool/7empest/7empest.test.ts',
        ]
    });

    // When
    const result = await getSourceCode(tsConfigResult, injector);

    // Then
    t.is(result.length, 4);
    t.deepEqual(result.map(x => x.path), [
        normalize('/tralalero/tralala/src/index.ts'),
        normalize('/tralalero/tralala/src/tool/7empest/index.ts'),
        normalize('/tralalero/tralala/src/tool/7empest/7empest.ts'),
        normalize('/tralalero/tralala/src/tool/7empest/7empest.test.ts'),
    ]);
});

test('Get files from "./src", ignoring tests files', async t => {
    // Weld
    const { tsConfigResult, injector } = getSourceCodeMock({
        path: '/tralalero/tralala/tsconfig.json',
        config: {
            compilerOptions: {
                outDir: 'dist',
                rootDir: 'src'
            },
            exclude: [
                './**/*.test.ts'
            ]
        },
        platform: 'linux',
        files: [
            './src/index.ts',
            './src/tool/7empest/index.ts',
            './src/tool/7empest/7empest.ts',
            './src/tool/7empest/7empest.test.ts',
        ]
    });

    // When
    const result = await getSourceCode(tsConfigResult, injector);

    // Then
    t.is(result.length, 3);
    t.deepEqual(result.map(x => x.path), [
        normalize('/tralalero/tralala/src/index.ts'),
        normalize('/tralalero/tralala/src/tool/7empest/index.ts'),
        normalize('/tralalero/tralala/src/tool/7empest/7empest.ts'),
    ]);
});

test('Get files from "./src", ignoring tests files and node_modules', async t => {
    // Weld
    const { tsConfigResult, injector } = getSourceCodeMock({
        path: '/tralalero/tralala/tsconfig.json',
        config: {
            compilerOptions: {
                outDir: 'dist',
                rootDir: 'src'
            },
            exclude: [
                './**/*.test.ts'
            ]
        },
        platform: 'linux',
        files: [
            './src/index.ts',
            './src/tool/7empest/index.ts',
            './src/tool/7empest/7empest.ts',
            './src/tool/7empest/7empest.test.ts',
            './node_modules/joder/index.ts',
            './node_modules/joder/chaval.ts',
        ]
    });

    // When
    const result = await getSourceCode(tsConfigResult, injector);

    // Then
    t.is(result.length, 3);
    t.deepEqual(result.map(x => x.path), [
        normalize('/tralalero/tralala/src/index.ts'),
        normalize('/tralalero/tralala/src/tool/7empest/index.ts'),
        normalize('/tralalero/tralala/src/tool/7empest/7empest.ts'),
    ]);
});