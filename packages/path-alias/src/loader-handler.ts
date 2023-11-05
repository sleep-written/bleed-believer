import { fileURLToPath } from 'url';
import { join, relative } from 'path';

import { type TsconfigOpts } from './tsconfig/index.js';
import { accessSync } from 'fs';

export class LoaderHandler {
    #outDir: string;
    #rootDir: string;
    #baseUrl: string;
    #aliases: { alias: string; paths: string[]; }[];

    constructor(config: TsconfigOpts) {
        this.#outDir = config.outDir;
        this.#rootDir = config.rootDir;
        this.#baseUrl = config.baseUrl;
        this.#aliases = Object
            .entries(config.paths)
            .map(([ alias, paths ]) => ({ alias, paths }));
    }

    #fileExists(path: string): boolean {
        try {
            accessSync(path);
            return true;
        } catch {
            return false;
        }
    }

    isSourceFile(specifierOrURL: string, context?: { parentURL?: string; }): boolean {
        // Converting the specifier into a path if is an URL
        try {
            specifierOrURL = fileURLToPath(specifierOrURL);
        } catch {
            specifierOrURL = specifierOrURL;
        }

        // Attach the path into the parent's path if parent exists
        if (typeof context?.parentURL === 'string') {
            specifierOrURL = join(
                fileURLToPath(context.parentURL),
                '..', specifierOrURL
            );
        }

        // Return the boolean
        return specifierOrURL.startsWith(this.#rootDir);
    }

    parseResolve(
        specifier: string,
        context: { parentURL?: string; }
    ): {
        isSourceFile: boolean;
        specifier: string;
    } {
        const isSourceFile = this.isSourceFile(specifier, context);
        if (typeof context.parentURL !== 'string') {
            return { isSourceFile, specifier };
        }

        let foundPath: string | undefined;
        for (let { alias, paths } of this.#aliases) {
            if (alias.includes('*')) {
                alias = alias.replaceAll('*', '');
                if (specifier.startsWith(alias)) {
                    specifier = specifier.replace(alias, '');
                    for (const path of paths) {
                        let targetPath = join(
                            this.#baseUrl,
                            path.replace('*', ''),
                            specifier
                        );

                        if (isSourceFile) {
                            targetPath = targetPath.replace(/(?<=\.m?)js$/gi, 'ts');
                        } else {
                            targetPath = targetPath.replace(this.#rootDir, this.#outDir);
                        }
    
                        const exists = this.#fileExists(targetPath);
                        if (exists) {
                            foundPath = targetPath;
                            break;
                        }
                    }
                }

            } else if (specifier === alias) {
                for (const path of paths) {
                    let targetPath = join(
                        this.#baseUrl,
                        path,
                        specifier
                    );

                    if (isSourceFile) {
                        targetPath = targetPath.replace(/(?<=\.m?)js$/gi, 'ts');
                    } else {
                        targetPath = targetPath.replace(this.#rootDir, this.#outDir);
                    }

                    const exists = this.#fileExists(targetPath);
                    if (exists) {
                        foundPath = targetPath;
                        break;
                    }
                }
            } else {
                continue;
            }

            if (foundPath) {
                const parentPath = join(fileURLToPath(context.parentURL), '..');
                specifier = relative(parentPath, foundPath);
                if (!specifier.match(/^\.{1,3}(\\|\/)/)) {
                    specifier = './' + specifier;
                }
                break;
            }
        }

        if (isSourceFile) {
            specifier = specifier.replace(/(?<=\.m?)js$/gi, 'ts');
        }

        console.log('parsed specified:', specifier);
        return { isSourceFile, specifier };
    }
}