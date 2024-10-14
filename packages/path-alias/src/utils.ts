import { join } from 'path';

import { ExtParser } from '@tool/ext-parser/index.js';
import { TsConfig } from '@tool/ts-config/index.js';

/**
 * Determines whether the provided URL corresponds to a TypeScript source file.
 *
 * @param url - The URL or file path to check.
 * @returns `true` if the URL corresponds to a TypeScript file, `false` otherwise.
 *
 * @example
 * ```ts
 * // In a TypeScript file
 * const isTs = isSourceCode('/path/to/file.ts');
 * console.log(isTs); // Output: true
 *
 * // In a JavaScript file
 * const isTs = isSourceCode('/path/to/file.js');
 * console.log(isTs); // Output: false
 * ```
 */
export function isSourceCode(url: string): boolean {
    const extParser = new ExtParser(url);
    return extParser.isTs();
}

let tsConfig: TsConfig;

/**
 * Resolves the absolute path(s) of the specified input, adapting based on whether
 * the code is running in TypeScript or JavaScript mode, and the provided options.
 * 
 * @param input - The relative path or alias to resolve.
 * @param options - Optional settings for resolving the path(s).
 * @param options.url - The URL or file path of the calling module. This is used to determine if the
 * calling code is TypeScript or JavaScript, based on the file extension. If not provided, the function
 * assumes the calling code is TypeScript.
 * @param options.multi - If set to `true`, returns an array of resolved paths. Defaults to `false`.
 * @returns The resolved absolute path as a string, or an array of strings if `options.multi` is `true`.
 * 
 * The function uses the `tsconfig.json` configuration to resolve paths and aliases.
 * If the calling code is determined to be JavaScript (e.g., if `options.url` has a `.js` extension),
 * the resolved paths will point to the compiled JavaScript files in the `outDir` directory.
 * If the calling code is TypeScript (e.g., if `options.url` has a `.ts` extension), the resolved paths
 * will point to the source TypeScript files in the `rootDir` directory.
 * 
 * @example
 * ```ts
 * // In a TypeScript file, resolving a single path
 * const singlePath = pathResolve('@tool/example.ts', { url: __filename });
 * console.log(singlePath); 
 * // Output: /absolute/path/to/src/tool/example.ts
 * 
 * // In a JavaScript file, resolving a single path
 * const singlePath = pathResolve('@tool/example.ts', { url: __filename });
 * console.log(singlePath); 
 * // Output: /absolute/path/to/dist/tool/example.js
 * 
 * // Resolving multiple paths in TypeScript
 * const multiplePaths = pathResolve('@greetings/*.ts', { multi: true });
 * console.log(multiplePaths);
 * // Output: ['/absolute/path/to/src/greetings/hello.ts', '/absolute/path/to/src/greetings/welcome.ts', ...]
 * ```
 */
export function pathResolve(input: string, options?: {
    url?: string;
    multi?: false;
}): string;

export function pathResolve(input: string, options?: {
    url?: string;
    multi?: true;
}): string[];

export function pathResolve(input: string, options?: {
    url?: string;
    multi?: boolean;
}): string | string[] {
    if (!tsConfig) {
        tsConfig = TsConfig.load();
    }

    const rootDir = join(process.cwd(), tsConfig.rootDir);
    const outDir = join(process.cwd(), tsConfig.outDir);
    const isTs = typeof options?.url == 'string'
        ?   isSourceCode(options.url)
        :   true;

    const result = tsConfig
        .resolveAll(input)
        .map(x => {
            if (
                typeof options?.url == 'string' &&
                !isSourceCode(options?.url)
            ) {
                const especifier = new ExtParser(x).toJs();
                return especifier.replace(rootDir, outDir);
            } else {
                return x;
            }
        });

    if (result.length === 0) {
        const specifier = new ExtParser(input);
        const basePath = isTs
            ?   join(process.cwd(), tsConfig.rootDir, specifier.toTs())
            :   join(process.cwd(), tsConfig.outDir,  specifier.toJs());

        result.push(basePath);
    }

    if (!options?.multi) {
        return result[0];
    } else {
        return result;
    }
}