import { tsConfigToSwcOptions } from './ts-config-to-swc-options.js';
import micromatch from 'micromatch';
import test from 'ava';
import type { TsConfigResult } from 'get-tsconfig';

// Mock para micromatch.makeRe
const originalMakeRe = micromatch.makeRe;
test.before(() => {
    micromatch.makeRe = (pattern) => ({ 
        source: `mocked_${pattern}` 
    } as RegExp);
});

test.after(() => {
    micromatch.makeRe = originalMakeRe;
});

// Test básico con configuración mínima
test('Convierte un tsconfig vacío a opciones swc básicas', t => {
    // Given
    const tsConfigResult: TsConfigResult = {
        path: '/tralalero/tralala/tsconfig.json',
        config: {}
    };

    // When
    const options = tsConfigToSwcOptions(tsConfigResult);

    // Then
    t.is(options.cwd, '/tralalero/tralala');
    t.is(options.jsc?.target, 'es2022');
    t.is(options.isModule, true);
    t.deepEqual(options.module, {
        strict: true,
        strictMode: true,
        type: 'es6',
        resolveFully: true
    });
});

// Test de cache
test('Devuelve opciones clonadas desde cache para el mismo tsconfig', t => {
    // Given
    const tsConfigResult: TsConfigResult = {
        path: '/tralalero/tralala/tsconfig.json',
        config: {
            compilerOptions: {
                target: 'ES2020'
            }
        }
    };

    // When
    const options1 = tsConfigToSwcOptions(tsConfigResult);
    // Modificamos la primera salida para verificar que la segunda sea un clon
    options1.jsc!.target = 'es2019';
    const options2 = tsConfigToSwcOptions(tsConfigResult);

    // Then
    t.not(options1, options2);
    t.is(options2.jsc?.target, 'es2020');
});

// Test de decoradores
test('Configura correctamente las opciones de decoradores', t => {
    // Given
    const tsConfigResult: TsConfigResult = {
        path: '/tralalero/tralala/tsconfig.json',
        config: {
            compilerOptions: {
                experimentalDecorators: true,
                emitDecoratorMetadata: true
            }
        }
    };

    // When
    const options = tsConfigToSwcOptions(tsConfigResult);

    // Then
    t.true(options.jsc?.parser?.decorators);
    t.true(options.jsc?.transform?.decoratorMetadata);
});

// Test de opciones de módulo
test('Configura correctamente commonjs', t => {
    // Given
    const tsConfigResult: TsConfigResult = {
        path: '/tralalero/tralala/tsconfig.json',
        config: {
            compilerOptions: {
                module: 'commonjs'
            }
        }
    };

    // When
    const options = tsConfigToSwcOptions(tsConfigResult);

    // Then
    t.false(options.isModule);
});

test('Configura correctamente módulos nodenext', t => {
    // Given
    const tsConfigResult: TsConfigResult = {
        path: '/tralalero/tralala/tsconfig.json',
        config: {
            compilerOptions: {
                module: 'nodenext'
            }
        }
    };

    // When
    const options = tsConfigToSwcOptions(tsConfigResult);

    // Then
    t.true(options.isModule);
    t.is(options.module?.type, 'nodenext');
});

// Test de source maps
test('Configura correctamente sourceMaps inline', t => {
    // Given
    const tsConfigResult: TsConfigResult = {
        path: '/tralalero/tralala/tsconfig.json',
        config: {
            compilerOptions: {
                inlineSourceMap: true,
                sourceRoot: '/src'
            }
        }
    };

    // When
    const options = tsConfigToSwcOptions(tsConfigResult);

    // Then
    t.is(options.sourceMaps, 'inline');
    t.is(options.sourceRoot, '/src');
});

test('Configura correctamente sourceMaps externos', t => {
    // Given
    const tsConfigResult: TsConfigResult = {
        path: '/tralalero/tralala/tsconfig.json',
        config: {
            compilerOptions: {
                sourceMap: true
            }
        }
    };

    // When
    const options = tsConfigToSwcOptions(tsConfigResult);

    // Then
    t.true(options.sourceMaps);
});

// Test de JSX
test('Configura correctamente soporte para JSX/TSX', t => {
    // Given
    const tsConfigResult: TsConfigResult = {
        path: '/tralalero/tralala/tsconfig.json',
        config: {
            compilerOptions: {
                jsx: 'react'
            }
        }
    };

    // When
    const options = tsConfigToSwcOptions(tsConfigResult);

    // Then
    t.true((options.jsc?.parser as any)?.tsx);
});

// Test de paths
test('Configura correctamente baseUrl y paths', t => {
    // Given
    const tsConfigResult: TsConfigResult = {
        path: '/tralalero/tralala/tsconfig.json',
        config: {
            compilerOptions: {
                baseUrl: './src',
                paths: {
                    '@/*': ['*']
                }
            }
        }
    };

    // When
    const options = tsConfigToSwcOptions(tsConfigResult);

    // Then
    t.is(options.jsc?.baseUrl, '/tralalero/tralala/src');
    t.deepEqual(options.jsc?.paths, {
        '@/*': ['*']
    });
});

// Test de exclude
test('Transforma correctamente los patrones exclude', t => {
    // Given
    const tsConfigResult: TsConfigResult = {
        path: '/tralalero/tralala/tsconfig.json',
        config: {
            exclude: [
                '**/*.test.ts',
                'node_modules'
            ]
        }
    };

    // When
    const options = tsConfigToSwcOptions(tsConfigResult);

    // Then
    t.deepEqual(options.exclude, [
        'mocked_**/*.test.ts',
        'mocked_node_modules'
    ]);
});

// Test de comentarios
test('Configura correctamente la preservación de comentarios', t => {
    // Given
    const tsConfigResult: TsConfigResult = {
        path: '/tralalero/tralala/tsconfig.json',
        config: {
            compilerOptions: {
                removeComments: true
            }
        }
    };

    // When
    const options = tsConfigToSwcOptions(tsConfigResult);

    // Then
    t.false(options.jsc?.preserveAllComments);
});