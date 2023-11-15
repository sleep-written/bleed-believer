import { resolve } from 'path';
import { options } from './global.js';

/**
 * Checks the `RESOLVE_SRC` environment variable. If its value is `true`
 * the path will be resolved as a location inside your source code, otherwise
 * will be resolved as a path inside your transpiled code.
 * 
 * For example, in your `tsconfig.json`:
 * - outDir: `./dist`.
 * - rootDir: `./src`.
 * 
 * @example ```ts
 * import { pathResolve } from '@bleed-believer/path-alias';
 * 
 * // Environment variable RESOLVE_SRC=true
 * console.log(pathResolve('path/to/file.js'));
 * // output: home/user/project/src/path/to/file.js
 * 
 * // Environment variable RESOLVE_SRC!=true
 * console.log(pathResolve('path/to/file.js'));
 * // output: home/user/project/dist/path/to/file.js
 * ```
 * @param pathParts 
 */
export function pathResolve(...pathParts: string[]): string {
    const resolveAsSrc = (process.env as Record<string, string>)
        ?.RESOLVE_SRC
        ?.toLowerCase() === 'true';

    return resolve(
        resolveAsSrc
        ?   options.rootDir
        :   options.outDir,
        ...pathParts
    );
}