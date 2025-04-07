import type { GetTsConfigInjection, ResponseInstance } from './interfaces/index.js';
import type { TsConfigResult } from 'get-tsconfig';

import { basename, dirname, isAbsolute, join, normalize, parse, resolve } from 'path';
import { getTsconfig } from 'get-tsconfig';
import { statSync } from 'fs';

import {
    TsconfigFileNotFoundError,
    InvalidTsconfigFileError,
    InvalidStatsTypeError,
    ResponseStatusError,
    JSONParseError,
    StatsError,
    FetchError,
} from './errors/index.js';

export async function getTsConfig(
    path?: string | null,
    injection?: Partial<GetTsConfigInjection>
): Promise<TsConfigResult> {
    const getTsconfigFunction = injection?.getTsconfig ?? getTsconfig;
    const statSyncFunction = injection?.statSync ?? statSync;
    const processInstance = injection?.process ?? process;
    const fetchFunction = injection?.fetch ?? fetch;

    if (typeof path === 'string') {
        try {
            const url = new URL(path);
            let resp: ResponseInstance;
            try {
                resp = await fetchFunction(path);

            } catch (err) {
                const error = new FetchError(path);
                error.cause = err;
                throw error;

            }

            if (!resp.ok) {
                throw new ResponseStatusError(resp.status, path);

            }

            try {
                const text = await resp.text();
                const json = JSON.parse(text);

                return {
                    config: json,
                    path: join(
                        processInstance.cwd(),
                        basename(url.pathname)
                    )
                };

            } catch {
                throw new JSONParseError(path);

            }

        } catch (err: any) {
            if (
                !(err instanceof FetchError) &&
                !(err instanceof JSONParseError) &&
                !(err instanceof ResponseStatusError)
            ) {
                path = !isAbsolute(path)
                ?   normalize(join(processInstance.cwd(), path))
                :   normalize(path);

            } else {
                throw err;

            }
        }
    } else {
        path = processInstance.cwd();

    }

    const root = parse(path).root;
    while (true) {
        try {
            const stats = statSyncFunction(path);
            if (stats.isFile()) {
                const pathname = dirname(path);
                const filename = basename(path);
                const tsConfig = getTsconfigFunction(pathname, filename);
                if (!tsConfig) {
                    throw new InvalidTsconfigFileError(path);
                } else {
                    return tsConfig;
                }

            } else if (stats.isDirectory()) {
                const tsConfig = getTsconfigFunction(path);
                if (tsConfig) {
                    return tsConfig;
                }

                if (path === root) {
                    throw new TsconfigFileNotFoundError();
                } else {
                    path = resolve(path, '..');
                }

            } else {
                throw new InvalidStatsTypeError(path);

            }

        } catch (e) {
            if (
                !(e instanceof TsconfigFileNotFoundError) &&
                !(e instanceof InvalidTsconfigFileError) &&
                !(e instanceof InvalidStatsTypeError) &&
                !(e instanceof StatsError)
            ) {
                const error = new StatsError(path);
                error.cause = e;
                throw error;
            } else {
                throw e;

            }
        }
    }
}