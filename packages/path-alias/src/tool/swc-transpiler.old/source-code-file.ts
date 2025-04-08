import type { TsConfig } from '@tool/ts-config/index.js';

import { basename, dirname, resolve } from 'path';
import { mkdir, writeFile } from 'fs/promises';
import { transformFile } from '@swc/core';

import { ExtParser } from '@tool/ext-parser/index.js';

export class SourceCodeFile {
    #srcPath: string;
    #outPath: string;
    #tsConfig: TsConfig;

    constructor(srcPath: string, tsConfig: TsConfig) {
        const rootDir = resolve(tsConfig.cwd, tsConfig.rootDir);
        const outDir = resolve(tsConfig.cwd, tsConfig.outDir);

        this.#srcPath = srcPath;
        this.#outPath = new ExtParser(srcPath)
            .toJs()
            .replace(rootDir, outDir);

        this.#tsConfig = tsConfig;
    }

    async transpile(): Promise<void> {
        await mkdir(dirname(this.#outPath), { recursive: true });
        const swcConfig = this.#tsConfig.toSwcConfig();
        if (swcConfig.sourceMaps) {
            swcConfig.sourceFileName = this.#srcPath;
        }

        let { code, map } = await transformFile(this.#srcPath, swcConfig);
        if (map && swcConfig.sourceMaps) {
            code = `${code}\n\n//# sourceMappingURL=${basename(this.#outPath)}.map`;
            await writeFile(`${this.#outPath}.map`, map, 'utf-8');
        }

        return writeFile(this.#outPath, code, 'utf-8');
    }
}