import type { GetTsConfigInjection, StatsInstance } from './interfaces/index.js';
import type { TsConfigResult } from 'get-tsconfig';

import { basename, dirname, isAbsolute, join, normalize, parse, resolve } from 'path';
import { getTsconfig } from 'get-tsconfig';
import { statSync } from 'fs';

import {
    TsconfigFileNotFoundError,
    InvalidTsconfigFileError,
    InvalidStatsTypeError,
    StatsError,
} from './errors/index.js';

export function getTsConfig(
    input?: string | null,
    injection?: Partial<GetTsConfigInjection>
): TsConfigResult {
    const getTsconfigFunction = injection?.getTsconfig ?? getTsconfig;
    const statSyncFunction = injection?.statSync ?? statSync;
    const processInstance = injection?.process ?? process;
    
    let normalizedPath;
    if (input != null) {
        normalizedPath = !isAbsolute(input)
        ?   join(processInstance.cwd(), normalize(input))
        :   normalize(input);

    } else {
        normalizedPath = processInstance.cwd();

    }

    let stats: StatsInstance | null;
    try {
        stats = statSyncFunction(normalizedPath);
    } catch (err) {
        const error = new StatsError(normalizedPath);
        error.cause = err;
        throw error;
    }

    if (stats?.isFile()) {
        const result = getTsconfigFunction(
            dirname(normalizedPath),
            basename(normalizedPath)
        );

        if (result) {
            return result;
        }
        
        throw new InvalidTsconfigFileError(normalizedPath);

    } else if (stats?.isDirectory()) {
        const root = parse(normalizedPath).root;
        do {
            try {
                stats = statSyncFunction(join(
                    normalizedPath,
                    'tsconfig.json'
                ));
            } catch {
                stats = null;
            }

            if (stats?.isFile()) {
                const result = getTsconfigFunction(normalizedPath);
                if (result) {
                    return result;
                }

                throw new InvalidTsconfigFileError(normalizedPath);
            }

            normalizedPath = resolve(normalizedPath, '..');
        } while (normalizedPath != root);

        throw new TsconfigFileNotFoundError();
    }
    
    throw new InvalidStatsTypeError(normalizedPath);
}