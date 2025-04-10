import type { GetTsConfigInjection } from './interfaces/get-ts-config.injection.js';
import type { TsConfigResult } from 'get-tsconfig';

import { join } from 'path';

export function getTsConfigFilesystemMock(options: {
    cwd: string;
    target?: TsConfigResult;

    files?: string[];
    folders?: string[];
    symlinks?: string[];
}): GetTsConfigInjection {
    const files = options.files ?? [];
    const folders = options.folders ?? [];
    const symlinks = options.symlinks ?? [];

    return {
        process: {
            cwd: () => options.cwd
        },
        statSync(path) {
            if (
                symlinks.some(x => x.startsWith(path)) ||
                symlinks.some(x => path.startsWith(x))
            ) {
                return {
                    isFile:         () => false,
                    isDirectory:    () => false
                };
            } else if (files.includes(path) || (options.target && path === options.target.path)) {
                return {
                    isFile:         () => true,
                    isDirectory:    () => false
                };
            } else if (folders.some(x => x.startsWith(path))) {
                return {
                    isFile:         () => false,
                    isDirectory:    () => true
                };
            } else {
                throw new Error(`Location doesn't exists`);
            }
        },
        getTsconfig: (searchPath, configName, _) => {
            if (!searchPath) {
                searchPath = options.cwd;
            }

            if (!configName) {
                configName = 'tsconfig.json'
            }

            const path = join(searchPath, configName);
            if (options.target && path === options.target.path) {
                return options.target;
            } else {
                return null;
            }
        }
    };
}