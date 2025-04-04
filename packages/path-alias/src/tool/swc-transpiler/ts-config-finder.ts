import type { TsConfigFinderInjection } from './interfaces/index.js';
import type { TsConfigResult } from 'get-tsconfig';

import { basename, dirname, parse, resolve } from 'path';
import { getTsconfig } from 'get-tsconfig';
import { statSync } from 'fs';

export function tsConfigFinder(path: string, injection?: Partial<TsConfigFinderInjection>): TsConfigResult {
    const getTsconfigFunction = injection?.getTsconfig ?? getTsconfig;
    const statSyncFunction = injection?.statSync ?? statSync;
    const root = parse(path).root;

    while (true) {
        const stats = statSyncFunction(path);
        if (stats.isFile()) {
            const pathname = dirname(path);
            const filename = basename(path);
            const tsConfig = getTsconfigFunction(pathname, filename);
            if (!tsConfig) {
                throw new Error(`The path "${path}" isn't a valid tsconfig file.`);
            } else {
                return tsConfig;
            }

        } else if (stats.isDirectory()) {
            const tsConfig = getTsconfigFunction(path);
            if (tsConfig) {
                return tsConfig;
            }

            if (path !== root) {
                path = resolve(path, '..');
            } else {
                throw new Error('Cannot found a valid "tsconfig.json" file.');
            }
        } else {
            throw new Error(`The path "${path}" isn't available.`);
        }
    }
}