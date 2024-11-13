import type { TsConfigJson, TsConfigResult } from 'get-tsconfig';
import type { Options as SwcOptions } from '@swc/core';

import { basename, resolve, dirname } from 'path';
import { getTsconfig } from 'get-tsconfig';

import { normalizeTsConfig } from './normalize-ts-config.js';
import { toSWCConfig } from './to-swc-config.js';

import { ExtParser } from '../ext-parser/index.js';
import { logger } from '@/logger.js';

export class TsConfig {
    #cwd: string;
    get cwd(): string {
        return this.#cwd;
    }

    #path: string;
    get path(): string {
        return this.#path;
    }

    #config: TsConfigJson;
    get config(): TsConfigJson {
        return structuredClone(this.#config);
    }

    get outDir(): string {
        return this.#config?.compilerOptions?.outDir ?? '.';
    }

    get rootDir(): string {
        return this.#config?.compilerOptions?.rootDir ?? '.';
    }

    get baseUrl(): string {
        return this.#config?.compilerOptions?.baseUrl ?? '.';
    }

    // Nuevo diccionario para almacenar los patrones precompilados
    #pathRegexMap: { regex: RegExp; targetPaths: string[] }[];

    static load(searchPath?: string, filename?: string): TsConfig {
        if (!searchPath) {
            searchPath = process.cwd();
        }

        if (!filename) {
            filename = 'tsconfig.json';
        }

        const result = getTsconfig(searchPath, filename);
        if (!result) {
            throw new Error(`"${filename}" not found at "${searchPath}".`);
        } else {
            result.config?.exclude?.pop();
            return new TsConfig(result);
        }
    }

    constructor(result: TsConfigResult) {
        this.#config = normalizeTsConfig(result.config);
        this.#path = resolve(result.path);
        this.#cwd = dirname(this.#path);

        if (!this.#config.compilerOptions?.verbatimModuleSyntax) {
            logger.warn(
                    `In "${basename(this.#path)}", the option `
                +   `"compilerOptions.verbatimModuleSyntax"`
                +   ` must be true to work properly.`
            );
        }

        // Precompilar los patrones de paths en el constructor
        const compilerOptions = this.#config.compilerOptions ?? {};
        const paths = compilerOptions.paths ?? {};

        this.#pathRegexMap = [];
        for (const pattern in paths) {
            const regex = this.#patternToRegex(pattern);
            const targetPaths = paths[pattern];
            this.#pathRegexMap.push({ regex, targetPaths });
        }
    }

    #patternToRegex(pattern: string): RegExp {
        // Escapar caracteres especiales de regex excepto '*'
        let regexPattern = pattern.replace(/[.+^${}()|[\]\\]/g, '\\$&');
        // Reemplazar '*' por '(.+?)'
        regexPattern = regexPattern.replace(/\*/g, '(.+?)');
        return new RegExp('^' + regexPattern + '$');
    }

    #substituteWildcards(targetPath: string, matches: string[]): string {
        let index = 0;
        return targetPath.replace(/\*/g, () => matches[index++] || '');
    }

    toSwcConfig(): SwcOptions {
        return toSWCConfig(this);
    }

    resolveAll(moduleName: string, dist?: boolean): string[] {
        const compilerOptions = this.#config.compilerOptions ?? {};
        const baseUrl = compilerOptions.baseUrl ?? '.';
        const rootDir = resolve(this.cwd, this.rootDir);
        const outDir = resolve(this.cwd, this.outDir);

        const results: string[] = [];
        for (const { regex, targetPaths } of this.#pathRegexMap) {
            const match = regex.exec(moduleName);
            if (match) {
                // Extraer los grupos coincidentes, excluyendo la coincidencia completa
                const matchedGroups = match.slice(1);

                for (const targetPath of targetPaths) {
                    // Sustituir comodines en targetPath
                    const substitutedPath = this.#substituteWildcards(
                        targetPath,
                        matchedGroups
                    );

                    // Resolver la ruta relativa a baseUrl
                    let fullPath = resolve(this.cwd, baseUrl, substitutedPath);
                    if (!dist && fullPath.startsWith(rootDir)) {
                        fullPath = fullPath
                            .replace(/(?<=\.m?)j(?=(sx?)$)/gi, 't');

                    } else if (dist && fullPath.startsWith(rootDir)) {
                        fullPath = fullPath
                            .replace(rootDir, outDir)
                            .replace(/(?<=\.m?)t(?=(sx?)$)/gi, 'j');

                    }
                    
                    results.push(fullPath);
                }
            }
        }

        return results;
    }
}
