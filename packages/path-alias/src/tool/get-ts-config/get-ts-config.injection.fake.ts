import type { GetTsConfigInjection } from './interfaces/index.js';
import type { TsConfigJson } from 'get-tsconfig';

import { join, normalize } from 'path';
import { StatsError } from './errors/index.js';

export function getTsConfigInjectionFake(options: {
    cwd: string;
    files?: string[];
    folders?: string[];
    fetchjson?: TsConfigJson | string | Error;
    otherstats?: string[];
    otherfiles?: string[];
}): GetTsConfigInjection {
    const cwd = normalize(options.cwd);
    const files = options.files?.map(x => normalize(x)) ?? [];
    const folders = options.folders?.map(x => normalize(x)) ?? [];
    const otherstats = options.otherstats ?? [];
    const otherfiles = options.otherfiles ?? [];
    
    return {
        statSync(path: string) {
            const normalizedPath = normalize(path);
            if (
                files.includes(normalizedPath) ||
                otherfiles.includes(normalizedPath)
            ) {
                return {
                    isFile:         () => true,
                    isDirectory:    () => false
                };

            } else if (folders.some(x => x.startsWith(normalizedPath))) {
                return {
                    isFile:         () => false,
                    isDirectory:    () => true
                };

            } else if (otherstats.some(x => x === path)) {
                return {
                    isFile:         () => false,
                    isDirectory:    () => false
                };

            } else {
                throw new StatsError();

            }
        },
        getTsconfig(searchPath?: string, configName?: string) {
            const normalizedPath = normalize(join(
                searchPath ?? cwd,
                configName ?? 'tsconfig.json'
            ));

            if (files.includes(normalizedPath)) {
                return {
                    path: normalizedPath,
                    config: {}
                };

            } else {
                return null;

            }
        },
        fetch: async (_: string) => {
            if (options.fetchjson instanceof Error) {
                throw options.fetchjson;

            } else if (options.fetchjson != null) {
                const text = typeof options.fetchjson !== 'string'
                ?   JSON.stringify(options.fetchjson)
                :   options.fetchjson;

                return {
                    ok: true,
                    status: 200,
                    text: () => Promise.resolve(text)
                };
            } else {
                const text = 'File not found';
                return {
                    ok: false,
                    status: 404,
                    text: () => Promise.resolve(text)
                }
            }
        },
        process: {
            cwd: () => cwd
        }
    };
}