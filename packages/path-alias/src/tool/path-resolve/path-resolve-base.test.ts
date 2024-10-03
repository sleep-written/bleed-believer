import test from 'ava';
import { PathResolveBase } from './path-resolve-base.js';

function createResolver(isTsNode: boolean) {
    return new PathResolveBase({
        cwd: '/path/to/project',
        isTsNode,
        tsconfig: {
            compilerOptions: {
                target: 'ES2022',
                module: 'Node16',
                moduleResolution: 'Node16',

                strict: true,
                verbatimModuleSyntax: true,
                emitDecoratorMetadata: true,
                experimentalDecorators: true,

                outDir: './dist',
                rootDir: './src',
                baseUrl: './src',

                paths: {
                    '@entities/*': [ './entities/*' ],
                    '@tool/*': [ './tool/*', './tool-legacy/*' ]
                }
            }
        }
    });
}

test('path: ./path/to/file.ts; isTsNode = true', t => {
    const target = createResolver(true);
    const result = target.resolve('./path/to/file.ts');
    t.is(result, '/path/to/project/src/path/to/file.ts');
});

test('path: ./path/to/file.js; isTsNode = true', t => {
    const target = createResolver(true);
    const result = target.resolve('./path/to/file.js');
    t.is(result, '/path/to/project/src/path/to/file.ts');
});

test('path: ./path/to/file.ts; isTsNode = false', t => {
    const target = createResolver(false);
    const result = target.resolve('./path/to/file.ts');
    t.is(result, '/path/to/project/dist/path/to/file.js');
});

test('path: ./path/to/file.js; isTsNode = false', t => {
    const target = createResolver(false);
    const result = target.resolve('./path/to/file.js');
    t.is(result, '/path/to/project/dist/path/to/file.js');
});

test('path: @entities/*.ts; isTsNode = true', t => {
    const target = createResolver(true);
    const result = target.resolve('@entities/*.ts');
    t.is(result, '/path/to/project/src/entities/*.ts');
});

test('path: @entities/*.js; isTsNode = true', t => {
    const target = createResolver(true);
    const result = target.resolve('@entities/*.js');
    t.is(result, '/path/to/project/src/entities/*.ts');
});

test('path: @entities/*.ts; isTsNode = false', t => {
    const target = createResolver(false);
    const result = target.resolve('@entities/*.ts');
    t.is(result, '/path/to/project/dist/entities/*.js');
});

test('path: @entities/*.js; isTsNode = false', t => {
    const target = createResolver(false);
    const result = target.resolve('@entities/*.js');
    t.is(result, '/path/to/project/dist/entities/*.js');
});

test('path: @tool/deque.ts; isTsNode = true; multiple', t => {
    const target = createResolver(true);
    const result = target.resolve('@tool/deque.ts', true);
    t.deepEqual(result, [
        '/path/to/project/src/tool/deque.ts',
        '/path/to/project/src/tool-legacy/deque.ts'
    ]);
});

test('path: @tool/deque.js; isTsNode = true; multiple', t => {
    const target = createResolver(true);
    const result = target.resolve('@tool/deque.js', true);
    t.deepEqual(result, [
        '/path/to/project/src/tool/deque.ts',
        '/path/to/project/src/tool-legacy/deque.ts'
    ]);
});

test('path: @tool/deque.ts; isTsNode = false; multiple', t => {
    const target = createResolver(false);
    const result = target.resolve('@tool/deque.ts', true);
    t.deepEqual(result, [
        '/path/to/project/dist/tool/deque.js',
        '/path/to/project/dist/tool-legacy/deque.js'
    ]);
});

test('path: @tool/deque.js; isTsNode = false; multiple', t => {
    const target = createResolver(false);
    const result = target.resolve('@tool/deque.js', true);
    t.deepEqual(result, [
        '/path/to/project/dist/tool/deque.js',
        '/path/to/project/dist/tool-legacy/deque.js'
    ]);
});