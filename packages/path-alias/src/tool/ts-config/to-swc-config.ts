import type { Options as SwcOptions } from '@swc/core';
import type { TsConfig } from './ts-config.js';
import { dirname, resolve } from 'path';

export function toSWCConfig(tsConfigBase: TsConfig): SwcOptions {
    const { path, config } = tsConfigBase;
    const options: SwcOptions = {};
    const {
        emitDecoratorMetadata, experimentalDecorators,
        removeComments, module, target, baseUrl,
        sourceMap, sourceRoot, paths, jsx,
        inlineSourceMap
    } = config.compilerOptions ?? {};

    options.cwd = dirname(path);
    options.sourceRoot = sourceRoot;
    options.sourceMaps = inlineSourceMap
        ?   'inline'
        :   sourceMap;

    options.exclude = config.exclude
        ?.map(x => !x.startsWith('./') ? `./${x}` : x);

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

    return options;
}