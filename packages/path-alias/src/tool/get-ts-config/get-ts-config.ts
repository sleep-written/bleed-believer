import type { GetTsConfigInjection, ResponseInstance, StatsInstance } from './interfaces/index.js';
import type { TsConfigResult } from 'get-tsconfig';

import { basename, dirname, isAbsolute, join, normalize, parse, resolve } from 'path';
import { access, mkdir, rm, writeFile } from 'fs/promises';
import { getTsconfig } from 'get-tsconfig';
import { randomUUID } from 'crypto';
import { statSync } from 'fs';
import { tmpdir } from 'os';


import {
    TsconfigFileNotFoundError,
    InvalidTsconfigFileError,
    InvalidStatsTypeError,
    InvalidProtocolError,
    ResponseStatusError,
    JSONParseError,
    StatsError,
    FetchError,
} from './errors/index.js';

export async function getTsConfig(
    input?: string | null,
    injection?: Partial<GetTsConfigInjection>
): Promise<TsConfigResult> {
    const getTsconfigFunction = injection?.getTsconfig ?? getTsconfig;
    const statSyncFunction = injection?.statSync ?? statSync;
    const processInstance = injection?.process ?? process;
    const fetchFunction = injection?.fetch ?? fetch;
    
    let normalizedPath;
    if (input != null) {
        let url: URL | null;
        try {
            url = new URL(input);
        } catch {
            url = null;
        }

        if (url) {
            switch (url.protocol) {
                case 'http:':
                case 'https:':
                    break;

                default:
                    throw new InvalidProtocolError(url.protocol);
            }

            let response: ResponseInstance;
            try {
                response = await fetchFunction(input);
            } catch (err) {
                const error = new FetchError(input);
                error.cause = err;
                throw error;
            }

            if (!response.ok) {
                throw new ResponseStatusError(response.status, input);
            }

            try {
                const text = await response.text();
                while (true) {
                    const tmpPath = join(
                        tmpdir(),
                        `@bleed-believer/path-alias`,
                        `tsconfig.${randomUUID()}.json`
                    );

                    let found: boolean;
                    try {
                        await access(tmpPath);
                        found = true;
                    } catch {
                        found = false;
                    }

                    if (!found) {
                        const dir = dirname(tmpPath);
                        const name = basename(tmpPath);
                        await mkdir(dir, { recursive: true });
                        await writeFile(tmpPath, text, 'utf-8');

                        const result = getTsconfigFunction(dir, name);
                        await rm(tmpPath, { force: true });
                        if (result) {
                            result.path = join(
                                processInstance.cwd(),
                                basename(url.pathname)
                            );

                            return result;
                        }
                        
                        throw new InvalidTsconfigFileError(normalizedPath);
                    }
                }
                

            } catch (err) {
                const error = new JSONParseError(input);
                error.cause = err;
                throw error;
            }
        }

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