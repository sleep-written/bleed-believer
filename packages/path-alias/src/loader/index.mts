import * as tsConfigPaths from 'tsconfig-paths';
import * as path from 'path';

import { resolve as resolveTs, ResolveFn } from 'ts-node/esm';
import { pathToFileURL } from 'url';
import { pathAlias } from '../path-alias.js';
import { replace } from './replace.mjs';

const matchPath = tsConfigPaths.createMatchPath(
    path.resolve(pathAlias.opts.baseUrl),
    pathAlias.opts.paths
);

export { load, transformSource } from 'ts-node/esm';
export const resolve: ResolveFn = (specifier, context, defaultResolve) => {
    if (pathAlias.isTsNode) {
        const lastIndexOfIndex = specifier.lastIndexOf('/index.js');
        if (lastIndexOfIndex !== -1) {
            // Handle index.js
            const trimmed = specifier.substring(0, lastIndexOfIndex);
            const match = matchPath(trimmed);

            if (match) return resolveTs(
                pathToFileURL(`${match}/index.js`).href,
                context,
                defaultResolve
            );
        } else if (specifier.endsWith('.js')) {
            // Handle *.js
            const trimmed = specifier.substring(0, specifier.length - 3);
            const match = matchPath(trimmed);

            if (match) return resolveTs(
                pathToFileURL(`${match}.js`).href,
                context,
                defaultResolve
            );
        }

        return resolveTs(specifier, context, defaultResolve);
    } else {
        specifier = replace(specifier, context?.parentURL);
        return defaultResolve(specifier, context, defaultResolve);
    }
}