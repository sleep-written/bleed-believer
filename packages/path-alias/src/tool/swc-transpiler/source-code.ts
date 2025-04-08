import type { SourceCodeInstanceInjection, SourceCodeInstance } from './interfaces/index.js';
import type { TsConfigResult } from 'get-tsconfig';

import { dirname, join, resolve } from 'path';
import fastGlob from 'fast-glob';

export class SourceCode implements SourceCodeInstance {
    static async getSourceCode(
        tsConfigResult: TsConfigResult,
        injection?: Partial<SourceCodeInstanceInjection>
    ): Promise<SourceCodeInstance[]> {
        const processInstance = injection?.process ?? process;
        const isWindows = processInstance.platform === 'win32';

        const tsConfig = tsConfigResult.config;
        const include: string[] = [];
        if (tsConfig.compilerOptions?.rootDir) {
            include.push(join(
                tsConfig.compilerOptions.rootDir,
                './**/*.{ts,mts,cjs}'
            ));
        }
        
        if (tsConfig.compilerOptions?.rootDirs) {
            const rootDirs = tsConfig.compilerOptions.rootDirs
                .map(x => join(x, './**/*.{ts,mts,cjs}'));

            include.push(...rootDirs);
        }
        
        if (include.length === 0) {
            include.push('./**/*.{ts,mts,cjs}');
        }

        const exclude = tsConfigResult.config.exclude ?? [];

        if (isWindows) {
            include.forEach((_, i) => {
                include[i] = include[i].replace('\\', '/');
            });

            exclude.forEach((_, i) => {
                exclude[i] = exclude[i].replace('\\', '/');
            });
        }

        const sources = await fastGlob(include, {
            dot: true,
            cwd: dirname(tsConfigResult.path),
            ignore: exclude,
            absolute: true,
            globstar: true,
            onlyFiles: true,
            objectMode: true
        });

        return sources.map(({ path }) => new SourceCode(
            path,
            tsConfigResult
        ));
    }

    #tsConfigResult: TsConfigResult;

    #path: string;
    get path(): string {
        return this.#path;
    }

    constructor(
        path: string,
        tsConfigResult: TsConfigResult,
        injection?: Partial<SourceCodeInstanceInjection>
    ) {
        this.#tsConfigResult = tsConfigResult;
        this.#path = path;
    }

    async transpile(): Promise<void> {
        const outDir = typeof this.#tsConfigResult.config.compilerOptions?.outDir === 'string'
        ?   resolve(this.#tsConfigResult.path, this.#tsConfigResult.config.compilerOptions?.outDir)
        :   this.#tsConfigResult.path;

        const rootDir = typeof this.#tsConfigResult.config.compilerOptions?.rootDir === 'string'
        ?   resolve(this.#tsConfigResult.path, this.#tsConfigResult.config.compilerOptions?.rootDir)
        :   this.#tsConfigResult.path;

        const rootDirs = this.#tsConfigResult.config.compilerOptions?.rootDirs?.map(x => resolve(
            this.#tsConfigResult.path,
            x
        )) ?? [];
        
        let outPath: string;
        if (this.#path.startsWith(rootDir)) {
            
        }
        
        console.log('path:', this.#path);
    }
}