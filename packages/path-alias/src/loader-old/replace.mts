import { join, resolve } from 'path';
import { pathToFileURL } from 'url';

import { pathAlias } from '../path-alias.js';
import { leftReplacer } from '../tool/left-replacer.js';

export function replace(input: string, parentUrl?: string): string | undefined {
    // ParentURL is required
    if (typeof parentUrl !== 'string') {
        return input;
    }

    // Check if inside of...
    const path = process.platform !== 'win32'
        ?   new URL(parentUrl).pathname
        :   new URL(parentUrl).pathname
                .replace(/^(\\|\/)+/gi, '')
                .replace(/\//gi, '\\');

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

            let out: string;
            if (pathAlias.isTsNode) {
                out = result
                    .replace(/\.js$/gi, '.ts')
                    .replace(/\.mjs$/gi, '.mts');
            } else {
                out = result
                    .replace(/\.ts$/gi, '.js')
                    .replace(/\.mts$/gi, '.mjs');
            }

            if (process.platform === 'win32') {
                return pathToFileURL(out).href;
            } else {
                return out;
            }
        }
    }
    
    return undefined;
}