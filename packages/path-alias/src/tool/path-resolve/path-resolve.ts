import { getTsconfig } from 'get-tsconfig';

import { PathResolveBase } from './path-resolve-base.js';
import { isTsNode } from './is-ts-node.js';

let resolver: PathResolveBase | undefined;
export function pathResolve(path: string, multi: true): string[];
export function pathResolve(path: string, multi?: false): string;
export function pathResolve(path: string, multi?: boolean): string | string[] {
    if (!resolver) {
        resolver = new PathResolveBase({
            cwd: process.cwd(),
            isTsNode: isTsNode(),
            tsconfig: getTsconfig()?.config
        });
    }

    return resolver.resolve(path, multi as any) as any;
}
