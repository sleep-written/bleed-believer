import type { PathAliasOptions } from './interfaces/index.js';
import type { TsConfigJson } from 'get-tsconfig';

import { fileURLToPath } from 'url';
import path from 'path';

import { isModuleInstalled } from '../is-module-installed/index.js';
import { isFileExists } from '../is-file-exists/index.js';
import { isFileUrl } from '../is-file-url/index.js';

interface CompiledPath {
    regex: RegExp;
    mappedPaths: string[];
}

export class PathAlias {
    #cwd: string;
    #entryPointInsideSrc: boolean;

    #isFileExists: (path: string) => Promise<boolean>;
    #isModuleInstalled: (moduleName: string) => boolean;

    #paths?: Record<string, string[]>;
    #baseUrl: string;
    
    #outDir: string;
    get outDir(): string {
        return this.#outDir;
    }

    #rootDir: string;
    get rootDir(): string {
        return this.#rootDir;
    }

    // Precompiled regex patterns for path mappings
    private readonly compiledPaths: CompiledPath[] = [];

    constructor(tsconfig: TsConfigJson, options?: Partial<PathAliasOptions>) {
        // Initialize private fields
        this.#cwd = options?.cwd ?? process.cwd();
        this.#isFileExists = options?.isFileExists ?? isFileExists;
        this.#isModuleInstalled = options?.isModuleInstalled ?? isModuleInstalled;

        const compilerOptions = tsconfig.compilerOptions ?? {};
        this.#paths = compilerOptions.paths;
        this.#outDir = path.resolve(this.#cwd, compilerOptions.outDir ?? '.');
        this.#rootDir = path.resolve(this.#cwd, compilerOptions.rootDir ?? '.');
        this.#baseUrl = path.resolve(this.#cwd, compilerOptions.baseUrl ?? '.');

        const entryPoint = options?.entryPoint ?? process.argv[1];
        this.#entryPointInsideSrc = this.isInsideSrc(entryPoint);

        // Precompile regex patterns for path mappings
        if (this.#paths) {
            for (const [pattern, mappedPaths] of Object.entries(this.#paths)) {
                // Escape special regex characters except for '*'
                const escapedPattern = pattern.replace(/([.+?^${}()|[\]\\])/g, '\\$1');

                // Replace '*' with '(.+)' to capture wildcard parts
                const regexPattern = '^' + escapedPattern.replace(/\*/g, '(.+)') + '$';
                const regex = new RegExp(regexPattern);

                // Store compiled regex and corresponding mapped paths
                this.compiledPaths.push({ regex, mappedPaths });
            }
        }
    }

    /**
     * Convert file extension from .js/.jsx/.mjs to .ts/.tsx.
     * @param specifier The module specifier to convert.
     * @returns The converted module specifier.
     */
    convertExtToTs(specifier: string): string {
        return specifier.replace(/(?<=\.m?)j(?=s(x?)$)/gi, 't');
    }

    /**
     * Convert file extension from .ts/.tsx/.mts to .js/.jsx.
     * @param specifier The module specifier to convert.
     * @returns The converted module specifier.
     */
    convertExtToJs(specifier: string): string {
        return specifier.replace(/(?<=\.m?)t(?=s(x?)$)/gi, 'j');
    }

    /**
     * Determine if a given path or URL is inside the root directory.
     * @param urlOrPath The path or URL to check.
     * @param pathParts Additional path segments to resolve.
     * @returns True if inside rootDir, false otherwise.
     */
    isInsideSrc(urlOrPath: string, ...pathParts: string[]): boolean {
        const normalizedPath = isFileUrl(urlOrPath)
            ? fileURLToPath(urlOrPath)
            : urlOrPath;

        const resolvedPath = path.resolve(normalizedPath, ...pathParts);
        const normalizedRootDir = path.join(this.#rootDir, path.sep);

        return resolvedPath.startsWith(normalizedRootDir);
    }

    resolvePath(pathOrSpecifier: string): string[] {
        for (const { regex, mappedPaths } of this.compiledPaths) {
            const match = regex.exec(pathOrSpecifier);
            if (match && mappedPaths.length > 0) {
                const capturedGroups = match.slice(1); // Exclude the full match
                const paths: string[] = [];

                for (const mappedPath of mappedPaths) {
                    let replacedPath = mappedPath;
                    capturedGroups.forEach(group => {
                        replacedPath = replacedPath.replace('*', group ?? '');
                    });

                    // Resolve the path relative to baseUrl and cwd
                    const resolvedPath = path.resolve(this.#baseUrl, replacedPath);
                    paths.push(resolvedPath);
                }

                return paths;
            }
        }

        return [pathOrSpecifier];
    }

    /**
     * Resolve a module specifier to its corresponding file path based on path aliases.
     * @param specifier The module specifier to resolve.
     * @returns The resolved file path or the original specifier with converted extension.
     */
    async resolveSpecifier(specifier: string, context?: { parentURL?: string; }): Promise<string> {
        if (!path.isAbsolute(specifier) && typeof context?.parentURL === 'string') {
            const parentPath = fileURLToPath(context.parentURL);
            if (this.isInsideSrc(parentPath)) {
                const specifierTs = this.convertExtToTs(specifier);
                const fullPath = path.resolve(parentPath, '..', specifierTs);

                if (await this.#isFileExists(fullPath)) {
                    specifier = specifierTs;
                }
            }
        }

        const fullPaths = this.resolvePath(specifier);
        for (const fullPath of fullPaths) {
            if (specifier != fullPath) {
                // Adjust the path based on whether the entry point is inside src
                let resolvedPath = fullPath;
                if (this.#entryPointInsideSrc) {
                    // Replace .js with .ts
                    resolvedPath = this.convertExtToTs(resolvedPath);
                } else {
                    // Replace the root path with the out path
                    resolvedPath = fullPath.replace(this.#rootDir, this.#outDir);
                }
    
                // Check if the file exists
                if (await this.#isFileExists(resolvedPath)) {
                    return resolvedPath;
                }
    
                // Check if the file exists (in *.js version)
                resolvedPath = this.convertExtToJs(resolvedPath);
                if (await this.#isFileExists(resolvedPath)) {
                    return resolvedPath;
                }
            }
        }

        // Return the specifier with converted extension if no patterns match
        const isFileExists = this.#isFileExists(specifier);
        const isModuleInstalled = this.#isModuleInstalled(specifier);
        if (!isFileExists && !isModuleInstalled) {
            return this.convertExtToTs(specifier);
        } else {
            return specifier;
        }
    }
}
