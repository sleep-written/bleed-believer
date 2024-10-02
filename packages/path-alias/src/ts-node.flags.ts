import type { TsConfigResult } from 'get-tsconfig';

import { dirname, resolve } from 'path';
import { getTsconfig } from 'get-tsconfig';
import { tmpdir } from 'os';
import { mkdir } from 'fs/promises';

import { PathAlias } from './tool/path-alias/index.js';
import { FlagDB } from './tool/flag-db/index.js';

const path = resolve(
    tmpdir(), '@bleed-believer/path-alias',
    `${process.pid}.bin`
);

await mkdir(dirname(path), { recursive: true });
const tsNodeFlagDB = new FlagDB(path, 'isTsNode');

let isTsNodeCache: boolean
export function isTsNode(): boolean {
    if (!isTsNodeCache) {
        try {
            const value = tsNodeFlagDB.getSync()?.isTsNode;
            if (value) {
                isTsNodeCache = true;
            }
    
            return value;

        } catch {
            return false;

        }

    } else {
        return true;

    }
}

export function markAsTsNode(): void {
    if (!isTsNodeCache) {
        isTsNodeCache = true;
        tsNodeFlagDB.setSync({ isTsNode: true });
    }
}

let pathResolveCache: TsConfigResult | null;
export function pathResolve(path: string): Promise<string> {
    const cwd = process.cwd();

    if (!pathResolveCache) {
        pathResolveCache = getTsconfig(cwd);
    }

    if (!pathResolveCache) {
        throw new Error('"tsconfig.json" file not found.');
    }

    const pathAlias = new PathAlias(pathResolveCache.config);
    return pathAlias.resolve(path);
}