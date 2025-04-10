import type { TsConfigResult } from 'get-tsconfig';

import { tsConfigToSwcOptions } from './ts-config-to-swc-options.js';
import test from 'ava';

test('Case 01', t => {
    // Weld
    const tsConfigResult: TsConfigResult = {
        path: '/tralalero/tralala/tsconfig.json',
        config: {
            compilerOptions: {
                target: 'es2024',
                module: 'node16',

                emitDecoratorMetadata: true,
                experimentalDecorators: true,

                outDir: 'dist',
                rootDir: 'src'
            }
        }
    };

    // When
    const options = tsConfigToSwcOptions(tsConfigResult);
    t.deepEqual(options, {
        cwd: '/tralalero/tralala',
        sourceRoot: undefined,
        sourceMaps: undefined,
        exclude: undefined,
        jsc: {
            target: 'es2024',
            parser: {
                syntax: 'typescript',
                decorators: true,
                tsx: false
            },
            transform: {
                decoratorMetadata: true
            },
            preserveAllComments: true,
            baseUrl: '/tralalero/tralala',
            paths: undefined
        },
        isModule: true,
        module: {
            strict: true,
            strictMode: true,
            type: 'es6',
            resolveFully: true
        }
    });
});