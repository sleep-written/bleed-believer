import { join } from 'path';

import { ExtParser } from '@tool/ext-parser/index.js';
import { TsConfig } from '@tool/ts-config/index.js';
import { TsFlag } from '@tool/ts-flag/index.js';

let tsConfig: TsConfig;
let tsFlag: TsFlag;

/**
 * Checks if the current execution environment is parsing TypeScript source code.
 * 
 * @returns `true` if the environment is parsing TypeScript source code, `false` otherwise.
 */
export function isSourceCode(): boolean {
    if (!tsFlag) {
        tsFlag = new TsFlag(`${process.pid}`);
    }

    return tsFlag.isParsingSourceCode;
}

/**
 * Resolves the absolute path of the specified input file, adapting based on whether
 * the code is running in TypeScript or JavaScript mode.
 * 
 * @param input - The relative path or alias to resolve.
 * @param multi - If set to `true`, returns an array of resolved paths. Defaults to `false`.
 * @returns The resolved absolute path as a string, or an array of strings if `multi` is `true`.
 * 
 * @example
 * ```ts
 * // Resolving a single path
 * const singlePath = pathResolve('@tool/example.ts');
 * console.log(singlePath); 
 * // Output: /absolute/path/to/src/tool/example.ts (or /absolute/path/to/dist/tool/example.js)
 * 
 * // Resolving multiple paths
 * const multiplePaths = pathResolve('@greetings/*.ts', true);
 * console.log(multiplePaths);
 * // Output: ['/absolute/path/to/src/greetings/hello.ts', '/absolute/path/to/src/greetings/welcome.ts', ...]
 * ```
 */
export function pathResolve(input: string, multi?: false): string;
export function pathResolve(input: string, multi: true): string[];
export function pathResolve(input: string, multi?: boolean): string | string[] {
    if (!tsConfig) {
        tsConfig = TsConfig.load();
    }

    const rootDir = join(process.cwd(), tsConfig.rootDir);
    const outDir = join(process.cwd(), tsConfig.outDir);
    const out = tsConfig
        .resolveAll(input)
        .map(x => {
            if (!isSourceCode()) {
                const especifier = new ExtParser(x).toJs();
                return especifier.replace(rootDir, outDir);
            } else {
                return x;
            }
        });

    if (out.length === 0) {
        const specifier = new ExtParser(input);
        const basePath = isSourceCode()
            ?   join(process.cwd(), tsConfig.rootDir, specifier.toTs())
            :   join(process.cwd(), tsConfig.outDir,  specifier.toJs());

        out.push(basePath);
    }

    if (!multi) {
        return out[0];
    } else {
        return out;
    }
}