import type { LoadHook } from 'module';
import { load as tsNodeLoad } from 'ts-node/esm';

import { loaderHandler } from '../global.js';

export const load: LoadHook = (url, context, nextResolve) => {
    const isSourceFile = loaderHandler.isSourceFile(url);
    if (isSourceFile) {
        return tsNodeLoad(url, context, nextResolve);

    } else {
        return nextResolve(url, context);

    }
};