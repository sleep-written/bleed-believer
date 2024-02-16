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
 * // output: home/user/project/src/path/to/file.ts
 * // (check the file extension)
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

    // Resolve the path
    let path = resolve(
        resolveAsSrc
        ?   options.rootDir
        :   options.outDir,
        ...pathParts
    );

    // Change extension
    const isUpper = path.at(-2)?.toUpperCase() === path.at(-2);
    if (resolveAsSrc) {
        path = path.replace(
            /(?<=\.m?)j(?=s$)/gi,
            isUpper ? 'T' : 't'
        );
    } else {
        path = path.replace(
            /(?<=\.m?)t(?=s$)/gi,
            isUpper ? 'J' : 'j'
        );
    }

    return path;
}