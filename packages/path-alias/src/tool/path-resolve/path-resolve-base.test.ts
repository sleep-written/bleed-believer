import type { TsConfigResult } from 'get-tsconfig';

import { PathResolveBase } from './path-resolve-base.js';
import test from 'ava';


function createResolver(cwd: string, isTsNodeResult: boolean) {
    const isTsNode = () => isTsNodeResult;

    const fakeProcess = {
        cwd: () => cwd
    };
    
    const getTsconfig = (s?: string): TsConfigResult | null => ({
        path: cwd,
        config: {
            compilerOptions: {
                target: 'ES2022',
                module: 'Node16',
                moduleResolution: 'Node16',
                verbatimModuleSyntax: true,

                outDir: './dist',
                rootDir: './src',
                baseUrl: './src',

                paths: {
                    '@entities/*': [ './entities/*' ],
                    '@tool/*': [ './tool/*' ],
                }
            }
        }
    });

    return new PathResolveBase({
        process: fakeProcess,
        getTsconfig,
        isTsNode,
    });
};

test('Path: "joder/chaval.ts"; isTsNode() => true', t => {
    const target = createResolver('/path/to/project', true);
    const result = target.resolve('joder/chaval.ts');
    t.is(result, '/path/to/project/src/joder/chaval.ts');
});

test('Path: "joder/chaval.js"; isTsNode() => true', t => {
    const target = createResolver('/path/to/project', true);
    const result = target.resolve('joder/chaval.js');
    t.is(result, '/path/to/project/src/joder/chaval.ts');
});

test('Path: "joder/chaval.ts"; isTsNode() => false', t => {
    const target = createResolver('/path/to/project', false);
    const result = target.resolve('joder/chaval.ts');
    t.is(result, '/path/to/project/dist/joder/chaval.js');
});

test('Path: "joder/chaval.js"; isTsNode() => false', t => {
    const target = createResolver('/path/to/project', false);
    const result = target.resolve('joder/chaval.js');
    t.is(result, '/path/to/project/dist/joder/chaval.js');
});
