import type { Options as SwcOptions } from '@swc/core';
import { dirname, resolve } from 'path';
import { TsConfig } from './ts-config.js';
import micromatch from 'micromatch';

const cache = new Map<TsConfig, SwcOptions>();

export function toSWCConfig(tsConfigBase: TsConfig): SwcOptions {
    if (cache.has(tsConfigBase)) {
        return cache.get(tsConfigBase)!;
    }
    
    const options: SwcOptions = {};
    const { path, config } = tsConfigBase;
    const {
        emitDecoratorMetadata, experimentalDecorators,
        removeComments, module, target,
        sourceMap, sourceRoot, jsx,
        inlineSourceMap,
        baseUrl, paths
    } = config.compilerOptions ?? {};

    options.cwd = dirname(path);
    options.sourceRoot = sourceRoot;
    options.sourceMaps = inlineSourceMap
        ?   'inline'
        :   sourceMap;

    options.exclude = config.exclude
        // ?.map(x => !x.startsWith('./') ? `./${x}` : x);
        ?.map(x => micromatch
            .makeRe(x)
            .source
        );

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
        baseUrl: resolve(dirname(path), (baseUrl ?? '.')),
        paths
    };
    
    switch (module) {
        case 'umd':
        case 'none':
        case 'system':
        case 'commonjs': {
            options.isModule = false;
            break;
        }

        case 'nodenext': {
            options.isModule = true;
            options.module = {
                strict: true,
                strictMode: true,
                type: 'nodenext',
                resolveFully: true
            } as any;
            break;
        }

        default: {
            options.isModule = true;
            options.module = {
                strict: true,
                strictMode: true,
                type: 'es6',
                resolveFully: true
            } as any;
        }
    }

    cache.set(tsConfigBase, options);
    return options;
}