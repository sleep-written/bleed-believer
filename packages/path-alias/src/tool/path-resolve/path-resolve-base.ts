import type { TsConfigJson } from 'get-tsconfig';
import { getTsconfig } from 'get-tsconfig';

import { isModuleInstalled } from '../is-module-installed/index.js';
import { isFileExists } from '../is-file-exists/index.js';
import { PathAlias } from '../path-alias/index.js';
import { resolve } from 'path';

export class PathResolveBase {
    #isTsNode: boolean;
    #pathAlias: PathAlias;

    constructor(inject: Partial<{
        cwd: string;
        tsconfig: TsConfigJson;
        isTsNode: boolean;
    }>) {
        const tsconfig = inject.tsconfig ?? getTsconfig()?.config;
        if (!tsconfig) {
            throw new Error('"tsconfig.json" not found.');
        }

        const cwd = inject.cwd ?? process.cwd();
        this.#isTsNode = !!inject.isTsNode;
        this.#pathAlias = new PathAlias(tsconfig, {
            cwd,
            isFileExists,
            isModuleInstalled
        });
    }

    resolve(path: string, multi: true): string[];
    resolve(path: string, multi?: false): string;
    resolve(path: string, multi?: boolean): string | string[] {
        let resolvedPaths = this.#pathAlias.resolvePath(path);
        if (!multi) {
            resolvedPaths = resolvedPaths.slice(0, 1);
        }

        const data = resolvedPaths.map(resolvedPath => {
            if (resolvedPath !== path) {
                if (this.#isTsNode) {
                    const tsPath = this.#pathAlias.convertExtToTs(resolvedPath);
                    return tsPath.replace(this.#pathAlias.outDir, this.#pathAlias.rootDir);
                } else {
                    const jsPath = this.#pathAlias.convertExtToJs(resolvedPath);
                    return jsPath.replace(this.#pathAlias.rootDir, this.#pathAlias.outDir);
                }
            } else if (this.#isTsNode) {
                const tsPath = this.#pathAlias.convertExtToTs(path);
                return resolve(this.#pathAlias.rootDir, tsPath);
            } else {
                const jsPath = this.#pathAlias.convertExtToJs(path);
                return resolve(this.#pathAlias.outDir, jsPath);
            }
        });

        if (!multi) {
            return data?.at(0) ?? path;
        } else {
            return data;
        }
    }
}