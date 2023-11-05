import type { ResolveHook } from 'module';
import { resolve as tsNodeResolve } from 'ts-node/esm';
import { loaderHandler } from './global.js';

export const resolve: ResolveHook = (originalSpecifier, context, nextResolve) => {
    // specifier = specifier.replace(/(?<=\.m?)js$/gi, 'ts');
    
    console.log('resolve hook:', { specifier: originalSpecifier, context }, '\n');
    const { isSourceFile, specifier } = loaderHandler.parseResolve(
        originalSpecifier,
        context
    );

    if (isSourceFile) {
        return tsNodeResolve(specifier, context, nextResolve);

    } else {
        return nextResolve(specifier, context);

    }
};