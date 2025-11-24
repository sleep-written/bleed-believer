import type { PathAliasInject } from './interfaces/index.js';
import type { TSConfig } from '@lib/ts-config/index.js';

import path from 'path';

export class PathAlias {
    #baseUrl: string;
    #paths: { pattern: RegExp; paths: string[]; }[];

    constructor(tsConfig: TSConfig, inject?: PathAliasInject) {
        const baseUrl = tsConfig.value.compilerOptions?.baseUrl ?? '.';
        const cwd = (inject?.process ?? process).cwd();

        this.#baseUrl = path.resolve(cwd, baseUrl);
        this.#paths = Object
            .entries(tsConfig.value.compilerOptions?.paths ?? {})
            .map(([ alias, paths ]) => ({
                pattern: new RegExp(
                    alias
                        .replace(/\*/g, '(?=.+)')
                        .replace(/^/, '^')
                ),
                paths: paths
                    .map(x => path.resolve(this.#baseUrl, x))
            }));
    }

    find(specifier: string): string[] | null {
        const found = this.#paths.find(({ pattern }) => pattern.test(specifier));
        if (found) {
            return found.paths
                .map(x => x
                    .replace(
                        /\*/g,
                        specifier.replace(found.pattern, '')
                    )
                );
        } else {
            return null;
        }

    }
}