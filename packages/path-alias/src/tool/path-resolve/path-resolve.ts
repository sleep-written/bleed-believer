import { getTsconfig } from 'get-tsconfig';

import { isTsNode } from './is-ts-node.js';
import { PathResolveBase } from './path-resolve-base.js';

const pathResolveBase = new PathResolveBase({ process, isTsNode, getTsconfig });
export function pathResolve(path: string) {
    return pathResolveBase.resolve(path);
}
