import { join, resolve } from 'path';
import { addAlias } from 'module-alias';
import { Module } from 'module';

import { leftReplacer } from '../tool/left-replacer.js';
import { pathAlias } from '../path-alias.js';
import { ModuleRef } from './module-ref.js';

// Declare the base path of the code to execute
const base = pathAlias.isTsNode
    ?   resolve(pathAlias.opts.rootDir)
    :   leftReplacer(
            resolve(pathAlias.opts.baseUrl),
            resolve(pathAlias.opts.rootDir),
            resolve(pathAlias.opts.outDir)
        );

// Replaces the original "_resolveFilename" with a custom one
const originalResolver = (Module as any)._resolveFilename;
(Module as any)._resolveFilename = (input: string, module: ModuleRef, flag: boolean) => {
    if (
        module &&
        pathAlias.isTsNode &&
        module.path.startsWith(base)
    ) {
        input = input.replace(/\.js$/gi, '.ts');
        input = input.replace(/\.mjs$/gi, '.mts');
    }

    return originalResolver(input, module, flag);
};

// Add all alias
Object
    .entries(pathAlias.opts.paths)
    .forEach(([alias, paths]) => {
        alias = alias.replace(/(\\|\/)\*/gi, '');
        paths
            .map(p => p.replace(/(\\|\/)\*/gi, ''))
            .forEach(p => {
                const path = join(base, p);
                addAlias(alias, path);

            });
    })

