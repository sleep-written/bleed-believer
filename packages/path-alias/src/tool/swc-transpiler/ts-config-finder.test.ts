import type { TsConfigResult } from 'get-tsconfig';
import { tsConfigFinder } from './ts-config-finder.js';
import { join } from 'path';
import test from 'ava';

function generateTsConfig(initPath: string, specPath: string): TsConfigResult {
    return tsConfigFinder(initPath, {
        statSync:    (path) => ({
            isFile:      () =>  path.endsWith('.json'),
            isDirectory: () => !path.endsWith('.json'),
        }),
        getTsconfig: (dirname, filename?) => {
            const path = join(
                dirname ?? process.cwd(),
                filename ?? 'tsconfig.json'
            );

            if (path === specPath) {
                return { path, config: {} };
            } else {
                return null;
            }
        }
    });
}

function buildTest(initPath: string, specPath: string, throwError?: boolean): void {
    test(`Get "${specPath}" from ${initPath}; error?: ${!!throwError}`, t => {
        if (!throwError) {
            const tsconfig = generateTsConfig(initPath, specPath);
            t.truthy(tsconfig);
            t.is(tsconfig.path, specPath);
        } else {
            t.throws(() => generateTsConfig(initPath, specPath));
        }
    });
}

buildTest('/tralalero/tralala', '/tralalero/tralala/tsconfig.json');
buildTest('/tralalero/tralala/src/tool', '/tralalero/tralala/tsconfig.json');

buildTest('/bombardino/cocodrilo', '/tralalero/tralala/tsconfig.json', true);
buildTest('/bombardino/cocodrilo/src/tool', '/tralalero/tralala/tsconfig.json', true);

buildTest('/tralalero/tralala/tung-tung-sahur.json', '/tralalero/tralala/tung-tung-sahur.json');
buildTest('/bombardino/cocodrilo/tung-tung-sahur.json', '/tralalero/tralala/tung-tung-sahur.json', true);