import { join, resolve } from 'path';

import { pathAlias } from '../path-alias.js';
import { leftReplacer } from '../tool/left-replacer.js';

export function replace(input: string, parentUrl?: string): string | undefined {
    // ParentURL is required
    if (typeof parentUrl !== 'string') {
        return input;
    }

    // Check if inside of...
    const path = new URL(parentUrl).pathname;
    const base = pathAlias.isTsNode
        ?   resolve(pathAlias.opts.baseUrl)
        :   leftReplacer(
                resolve(pathAlias.opts.baseUrl),
                resolve(pathAlias.opts.rootDir),
                resolve(pathAlias.opts.outDir)
            );

    if (path.startsWith(base)) {
        const found = Object
            .entries(pathAlias.opts.paths)
            .map(([k, v]) => ({
                alias: k.replace(/\*/gi, ''),
                path: v[0]?.replace(/\*/gi, '')
            }))
            .find(({ alias }) => input.startsWith(alias));

        if (found) {
            const fullPath = resolve(base, found.path);
            const result = input !== found.alias
                ?   join(fullPath, leftReplacer(input, found.alias, ''))
                :   fullPath;

            if (pathAlias.isTsNode) {
                return result
                    .replace(/\.js$/gi, '.ts')
                    .replace(/\.mjs$/gi, '.mts');
            } else {
                return result
                    .replace(/\.ts$/gi, '.js')
                    .replace(/\.mts$/gi, '.mjs');
            }
        }
    }
    
    return undefined;
}