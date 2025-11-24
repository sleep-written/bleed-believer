import type { TSConfigInject } from './interfaces/index.js';

import { tsConfigToSWC } from './ts-config.to-swc.js';
import { TSConfig } from './ts-config.js';
import test from 'ava';

const inject: TSConfigInject = {
    process: {
        cwd: () => '/path/to/project'
    }
};

test('Minimal configuration', t => {
    const tsConfig = new TSConfig({});
    const swcConfig = tsConfigToSWC(tsConfig.value, inject);
    t.deepEqual(swcConfig, {
        jsc: {
            target: 'esnext',
            preserveAllComments: true,
            transform: {
                decoratorMetadata: false,
                decoratorVersion: '2022-03',
                verbatimModuleSyntax: false,
                legacyDecorator: false
            },
            parser: { syntax: 'typescript', decorators: true },
            output: { charset: 'utf8' }
        },
        sourceMaps: false,
        module: {
            type: 'es6',
            strict: false,
            strictMode: false,
            resolveFully: true,
            allowTopLevelThis: true,
            preserveImportMeta: true,
            exportInteropAnnotation: true,
            importInterop: 'node'
        }
    });
});

test('es2024 with experimental decorators', t => {
    const tsConfig = new TSConfig({
        exclude: [ './src/**/*.test.ts' ],
        compilerOptions: {
            strict: true,
            target: 'es2024',
            module: 'node20',
            moduleResolution: 'node16',
            resolveJsonModule: true,
            verbatimModuleSyntax: true,
            emitDecoratorMetadata: true,
            experimentalDecorators: true,

            outDir: './dist',
            rootDir: './src',
            baseUrl: './src',
            paths: {
                '@lib/*': [ './lib/*' ]
            }
        }
    });

    const swcConfig = tsConfigToSWC(tsConfig.value, inject);
    t.deepEqual(swcConfig, {
        jsc: {
            target: 'es2024',
            baseUrl: '/path/to/project/src',
            paths: {
                '@lib/*': [ './lib/*' ]
            },
            preserveAllComments: true,
            transform: {
                decoratorMetadata: true,
                decoratorVersion: '2021-12',
                verbatimModuleSyntax: true,
                legacyDecorator: false
            },
            parser: { syntax: 'typescript', decorators: true },
            output: { charset: 'utf8' },
            experimental: {
                keepImportAssertions: true
            }
        },
        sourceMaps: false,
        exclude: [
            './src/**/*.test.ts'
        ],
        module: {
            type: 'es6',
            strict: true,
            strictMode: true,
            resolveFully: true,
            allowTopLevelThis: true,
            preserveImportMeta: true,
            exportInteropAnnotation: true,
            importInterop: 'node'
        },
    });
});