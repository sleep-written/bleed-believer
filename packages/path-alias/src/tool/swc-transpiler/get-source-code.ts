import type { SourceCodeInstance, GetSourceCodeInjection } from './interfaces/index.js';
import type { TsConfigResult } from 'get-tsconfig';

import { dirname, join, normalize } from 'path';
import { SourceCode } from './source-code.js';
import fastGlob from 'fast-glob';

export async function getSourceCode(
    tsConfigResult: TsConfigResult,
    injection?: Partial<GetSourceCodeInjection>
): Promise<SourceCodeInstance[]> {
    const fastGlobFunction = injection?.fastGlob ?? fastGlob;
    // const processInstance = injection?.process ?? process;

    // const isWindows = processInstance.platform === 'win32';
    const tsConfig = tsConfigResult.config;
    const include: string[] = [];
    if (tsConfig.compilerOptions?.rootDir) {
        include.push(normalize(join(
            tsConfig.compilerOptions.rootDir,
            './**/*.{ts,mts,cjs}'
        )));
    }
    
    if (tsConfig.compilerOptions?.rootDirs) {
        const rootDirs = tsConfig.compilerOptions.rootDirs
            .map(x => join(x, './**/*.{ts,mts,cjs}'))
            .map(x => normalize(x));

        include.push(...rootDirs);
    }
    
    if (include.length === 0) {
        include.push(normalize('./**/*.{ts,mts,cjs}'));
    }

    const exclude = tsConfigResult.config.exclude ?? [];
    exclude.unshift(normalize('./**/node_modules/*'));

    include.forEach((_, i) => {
        include[i] = normalize(include[i]);
    });

    exclude.forEach((_, i) => {
        exclude[i] = normalize(exclude[i]);
    });

    const sources = await fastGlobFunction(include, {
        dot: true,
        cwd: dirname(tsConfigResult.path),
        ignore: exclude,
        absolute: true,
        globstar: true,
        onlyFiles: true,
        objectMode: true
    });

    return sources.map(({ path }) => new SourceCode(path, tsConfigResult));
}
