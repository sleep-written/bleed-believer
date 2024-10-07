import type { Options as SwcOptions } from '@swc/core';
import type { TsConfig } from './ts-config.js';
import { join, resolve } from 'path';

export function toSWCConfig(tsConfigBase: TsConfig): SwcOptions {
    const { path, config } = tsConfigBase;
    const options: SwcOptions = {};
    const {
        emitDecoratorMetadata, experimentalDecorators,
        removeComments, module, target, baseUrl,
        sourceMap, sourceRoot, paths, jsx
    } = config.compilerOptions ?? {};

    options.sourceMaps = sourceMap;
    options.sourceRoot = sourceRoot;
    options.exclude = config.exclude;
    options.jsc = {
        target: target?.toLowerCase() as any ?? 'es2022',
        parser: {
            syntax: 'typescript',
            decorators: experimentalDecorators,
            tsx: !!jsx
        },
        transform: {
            decoratorMetadata: emitDecoratorMetadata
        },
        preserveAllComments: !removeComments,
        baseUrl: resolve(path, '..', baseUrl ?? '.'),
        paths
    };
    
    switch (module) {
        case 'ES2022':
        case 'Node16':
        case 'NodeNext': {
            options.isModule = true;
            options.module = {
                strict: true,
                strictMode: true,
                type: module == 'NodeNext'
                    ?   'nodenext'
                    :   'es6',
                resolveFully: true
            } as any;
            break;
        }

        default: {
            throw new Error(`tsconfig module "${module}" isn't supported.`);
        }
    }

    return options;
}