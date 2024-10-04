import test from 'ava';
import { TsConfig } from './ts-config.js';

// Sample tsconfig configuration for testing
const tsConfig = new TsConfig({
    path: '/path/to/project/tsconfig.json',
    config: {
        compilerOptions: {
            target: 'ES2022',
            module: 'Node16',
            moduleResolution: 'Node16',
            verbatimModuleSyntax: true,

            strict: true,
            emitDecoratorMetadata: true,
            experimentalDecorators: true,

            outDir: './dist',
            rootDir: './src',
            baseUrl: './src',

            paths: {
                '@entities/*': ['./entities/*'],
                '@tool/*': ['./tool/*', './tool-legacy/*'],
                '@ext/*/inside/*': ['./ext/*/inside/*'],
                '@direct': [ './path/to/file.js' ]
            },
        },
    },
});

test('Resolve "@entities/pendejo.js"', t => {
    const r = tsConfig.resolveAll('@entities/pendejo.js');
    t.deepEqual(r, ['/path/to/project/src/entities/pendejo.ts']);
});

test('Resolve "@tool/joder.js"', t => {
    const r = tsConfig.resolveAll('@tool/joder.js');
    t.deepEqual(r, [
        '/path/to/project/src/tool/joder.ts',
        '/path/to/project/src/tool-legacy/joder.ts',
    ]);
});

test('Resolve "@ext/main/inside/nya.js"', t => {
    const r = tsConfig.resolveAll('@ext/main/inside/nya.js');
    t.deepEqual(r, ['/path/to/project/src/ext/main/inside/nya.ts']);
});

test('Resolve "@direct"', t => {
    const r = tsConfig.resolveAll('@direct');
    t.deepEqual(r, ['/path/to/project/src/path/to/file.ts']);
});

test('Resolve "@noooooooo/joderrrr.js"', t => {
    const r = tsConfig.resolveAll('@noooooooo/joderrrr.js');
    t.deepEqual(r, []);
});

test('Resolve "@noooooooo"', t => {
    const r = tsConfig.resolveAll('@noooooooo');
    t.deepEqual(r, []);
});