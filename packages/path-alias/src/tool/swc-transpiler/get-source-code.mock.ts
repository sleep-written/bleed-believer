import type { GetSourceCodeInjection } from './interfaces/index.js';
import type { TsConfigResult } from 'get-tsconfig';
import type { Entry } from 'fast-glob';

import { dirname, isAbsolute, join, normalize, resolve } from 'path';
import micromatch from 'micromatch';

export function getSourceCodeMock(options: TsConfigResult & {
    platform: NodeJS.Process['platform'];
    files: string[];
}): {
    tsConfigResult: TsConfigResult;
    injector: GetSourceCodeInjection;
} {
    const cwd = dirname(options.path);
    const files = options.files.map(x => !isAbsolute(x)
        ?   resolve(cwd, x)
        :   normalize(x)
    );

    const tsConfigResult: TsConfigResult = {
        path: options.path,
        config: options.config
    };

    const injector: GetSourceCodeInjection = {
        process: {
            cwd: () => cwd,
            platform: options.platform
        },
        async fastGlob(source, { ignore }) {
            const globPatterns = !(source instanceof Array)
            ?   [ source ]
            :   source.slice();

            const includePatterns = globPatterns
                .map(x => join(cwd, x))
                .map(x => micromatch.makeRe(x));

            const excludePatterns = (ignore ?? [])
                .map(x => join(cwd, x))
                .map(x => micromatch.makeRe(x));

            return files
                .map(path => ({ path } as Entry))
                .filter(({ path }) =>
                     includePatterns.some(x => x.test(path)) &&
                    !excludePatterns.some(x => x.test(path))
                );
        }
    };

    return { tsConfigResult, injector };
}