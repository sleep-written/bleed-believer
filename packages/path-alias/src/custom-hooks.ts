import type { LoadHook, ResolveHook } from 'module';
import type { Options, Output } from '@swc/core';

import { fileURLToPath } from 'url';
import { transform } from '@swc/core';
import path from 'path';

import { isPackageInstalled } from '@tool/is-package-installed/index.js';
import { isFileExists } from '@tool/is-file-exists/index.js';
import { ExtParser } from '@tool/ext-parser/index.js';
import { TsConfig } from '@tool/ts-config/index.js';
import { TsFlag } from '@tool/ts-flag/index.js';

const tsConfig = TsConfig.load();
let swcConfig: Options;

const tsCache = new Map<string, Output>();
const tsFlag = new TsFlag(process.pid.toString());
export const load: LoadHook = async (url, context, defaultLoad) => {
    if (new ExtParser(url).isTs()) {
        tsFlag.markAsParsingSourceCode();
        context.format = 'module';
        const cache = tsCache.get(url);
        if (!cache) {
            if (!swcConfig) {
                swcConfig = tsConfig.toSwcConfig();
                swcConfig.sourceMaps = 'inline';
            }

            swcConfig.sourceFileName = fileURLToPath(url);
            const result = await defaultLoad(url, context);
            const rawTxt = (result.source as Buffer).toString('utf-8');
            const source = await transform(rawTxt, swcConfig);

            return {
                format: 'module',
                source: source.code,
                shortCircuit: true
            };
        } else {
            return {
                format: 'module',
                source: cache.code,
                sourceMap: cache.map,
                shortCircuit: true
            };
        }
    } else {
        return defaultLoad(url, context);
    }
}

const aliasCache = new Map<string, string>();
export const resolve: ResolveHook = async (specifier, context, defaultResolve) => {
    const specifierParser = new ExtParser(specifier);
    if (
        !specifierParser.isFileUrl() &&
        !path.isAbsolute(specifier) &&
        !isPackageInstalled(specifier)
    ) {
        // Building the path where the file is located
        const basePath = context.parentURL
            ?   path.resolve(fileURLToPath(context.parentURL), '..')
            :   tsConfig.path;

        if (!tsFlag.isParsingSourceCode) {
            // Is inside the outDir
            const fullPathJs = path.join(basePath, specifierParser.toJs());
            if (await isFileExists(fullPathJs)) {
                // The path relative to parent exists
                specifier = specifierParser.toJs();

            } else if (!aliasCache.has(specifier)) {
                // Find alias full paths
                const outDir = path.resolve(tsConfig.outDir);
                const rootDir = path.resolve(tsConfig.rootDir);
                const fullPaths = tsConfig.resolveAll(specifier);

                for (const fullPath of fullPaths) {
                    // check if the full resolved path exists
                    const fullPathJs = new ExtParser(fullPath).toJs();
                    const fullOutPath = fullPathJs.replace(rootDir, outDir);
                    if (await isFileExists(fullOutPath)) {
                        aliasCache.set(specifier, fullOutPath);
                        specifier = fullOutPath;
                        break;
                    }
                }
                
            } else {
                // Get alias from cache
                specifier = aliasCache.get(specifier)!;
    
            }
        } else {
            // Is inside the rootDir
            const fullPathTs = path.join(basePath, specifierParser.toTs());
            if (await isFileExists(fullPathTs)) {
                specifier = specifierParser.toTs();
            }
        }
    }

    return defaultResolve(specifier, context);
}