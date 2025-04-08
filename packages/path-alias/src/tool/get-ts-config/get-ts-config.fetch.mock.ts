import type { GetTsConfigInjection } from './interfaces/index.js';
import type { TsConfigJson } from 'get-tsconfig';

import { readFileSync } from 'fs';
import { resolve } from 'path';

export function getTsConfigFetchMock(options: {
    cwd: string;
    url: string;
    status: number;
    response: string | TsConfigJson;
}): GetTsConfigInjection {
    return {
        fetch: (url: string) => {
            const parsedURL = new URL(url);
            switch(parsedURL.protocol) {
                case 'http:':
                case 'https:':
                    break;

                default:
                    throw new Error('AjajjJAjaj');
            }

            return Promise.resolve({
                status: options.status,
                ok: options.status >= 200 && options.status < 300,
                text: () => Promise.resolve(
                    typeof options.response !== 'string'
                    ?   JSON.stringify(options.response)
                    :   options.response
                )
            });
        },
        process:     { cwd: () => options.cwd },
        statSync:    () => { throw new Error('Not implemented') },
        getTsconfig: (searchPath, configName, _) => {
            if (!searchPath) {
                searchPath = options.cwd;
            }

            if (!configName) {
                configName = 'tsconfig.json';
            }

            try {
                const path = resolve(searchPath, configName);
                const text = readFileSync(path, 'utf-8');
                const config = JSON.parse(text);
                return { path, config };

            } catch {
                return null;

            }
        }
    };
}