import type { MkdirFunction, SourceCodeInjection, SourceCodeInstance, TransformFileFunction, WriteFileFunction } from './interfaces/index.js';
import type { TsConfigResult } from 'get-tsconfig';

import { basename, dirname } from 'path';
import { mkdir, writeFile } from 'fs/promises';
import { transformFile } from '@swc/core';

import { tsConfigToSwcOptions } from './ts-config-to-swc-options.js';
import { getOutPath } from './get-out-path.js';

export class SourceCode implements SourceCodeInstance {
    #tsConfigResult: TsConfigResult;
    #transformFile: TransformFileFunction;
    #writeFile: WriteFileFunction;
    #mkdir: MkdirFunction;

    #path: string;
    get path(): string {
        return this.#path;
    }

    constructor(path: string, tsConfigResult: TsConfigResult, injection?: SourceCodeInjection) {
        this.#tsConfigResult = tsConfigResult;
        this.#transformFile = injection?.transformFile ?? transformFile;
        this.#writeFile = injection?.writeFile ?? writeFile;
        this.#mkdir = injection?.mkdir ?? mkdir;
        this.#path = path;
    }

    async transpile(): Promise<void> {
        const outPath = getOutPath(this.#path, this.#tsConfigResult);
        const swcOptions = tsConfigToSwcOptions(this.#tsConfigResult);

        delete swcOptions.exclude;
        await this.#mkdir(
            dirname(outPath),
            { recursive: true }
        );

        if (swcOptions.sourceMaps) {
            swcOptions.sourceFileName = this.#path;
        }
        
        let { code, map } = await this.#transformFile(this.#path, swcOptions);
        if (map && swcOptions.sourceMaps) {
            code = `${code}\n\n//# sourceMappingURL=${basename(outPath)}.map`;
            await this.#writeFile(`${outPath}.map`, map, 'utf-8');
        }

        return this.#writeFile(outPath, code, 'utf-8');
    }
}