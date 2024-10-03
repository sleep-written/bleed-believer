import type { TsConfigResult } from 'get-tsconfig';
import { resolve } from 'path';

import { PathAlias } from '../path-alias/index.js';

export class PathResolveBase {
    #isTsNode: () => boolean;
    #pathAlias: PathAlias;

    constructor(
        inject: {
            process: { cwd(): string; },
            isTsNode: () => boolean,
            entryPoint?: string,
            getTsconfig: (s?: string) => TsConfigResult | null,
        }
    ) {
        const cwd = inject.process.cwd();
        const entryPoint = inject.entryPoint;
        const tsconfigResult = inject.getTsconfig(cwd);
        if (!tsconfigResult) {
            throw new Error('"tsconfig.json" file not found.');
        }
        
        this.#isTsNode = inject.isTsNode;
        this.#pathAlias = new PathAlias(tsconfigResult.config, { cwd, entryPoint });
    }

    resolve(path: string) {
        const { outDir, rootDir } = this.#pathAlias;
        const resolvedPath = this.#pathAlias.resolvePath(path)[0] ?? path;
        const isTsNode = this.#isTsNode();
        if (resolvedPath != path) {
            if (isTsNode) {
                const rootDirPath = this.#pathAlias.convertExtToTs(resolvedPath);
                return this.#pathAlias.convertExtToTs(rootDirPath);
            } else {
                const outDirPath = resolvedPath.replace(rootDir, outDir);
                return this.#pathAlias.convertExtToJs(outDirPath);
            }
        } else if (isTsNode) {
            const tsPath = this.#pathAlias.convertExtToTs(resolvedPath);
            return resolve(rootDir, tsPath);
        } else {
            const jsPath = this.#pathAlias.convertExtToJs(resolvedPath);
            return resolve(outDir, jsPath);
        }
    }
}
