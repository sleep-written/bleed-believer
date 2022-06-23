import * as tsConfigPaths from 'tsconfig-paths';

import { resolve as resolveTs, ResolveFn } from 'ts-node/esm';
import { pathToFileURL } from 'url';
import { pathAlias } from '../path-alias.js';
import { replace } from './replace.mjs';

pathAlias.showInConsole();
const matchPath = tsConfigPaths.createMatchPath(
    pathAlias.opts.baseUrl,
    pathAlias.opts.paths
);

// Use the "load" function of ts-node only if applied
import { load as loadTs } from 'ts-node/esm';
export function load(
    url: string,
    context:  { format: string },
    defaultLoad: Function
): Promise<any> {
    const isTsNode = pathAlias.checkTsNode(url);
    if (isTsNode) {
        return (loadTs as any)(url, context, defaultLoad);
    } else {
        return defaultLoad(url, context, defaultLoad);
    }
}

// Use the ts-node mechanism only if applied
export const resolve: ResolveFn = (specifier, context, defaultResolve) => {
    const isTsNode = pathAlias.checkTsNode(specifier, context);
    if (isTsNode) {
        const lastIndexOfIndex = specifier.lastIndexOf('/index.js');
        if (lastIndexOfIndex !== -1) {
            // Handle index.js
            const trimmed = specifier.substring(0, lastIndexOfIndex);
            const match = matchPath(trimmed);
            if (match) {
                return resolveTs(
                    pathToFileURL(`${match}/index.js`).href,
                    context,
                    defaultResolve
                );
            }
        // } else if (specifier.endsWith('.js')) {
        //     // Handle *.js
        //     const trimmed = specifier.substring(0, specifier.length - 3);
        //     const match = matchPath(trimmed);
        //     if (match) {
        //         return resolveTs(
        //             pathToFileURL(`${match}.js`).href,
        //             context,
        //             defaultResolve
        //         );
        //     }
        } else {
            const ext = (specifier.match(/\.(m|c)?js$/gi) ?? ['.js'])[0];
            const clearedPath = specifier.replace(/\.(m|c)?js$/gi, '');
            
            const match = matchPath(clearedPath);
            if (match) {
                return resolveTs(
                    pathToFileURL(`${match}${ext}`).href,
                    context,
                    defaultResolve
                );
            }
        }

        return resolveTs(specifier, context, defaultResolve);
    } else {
        specifier = replace(specifier, context.parentURL);
        return defaultResolve(specifier, context, defaultResolve);
    }
}