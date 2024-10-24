import type { LoadHook, ResolveHook } from 'module';
import type { Options } from '@swc/core';

import { fileURLToPath, pathToFileURL } from 'url';
import { transform } from '@swc/core';
import path from 'path';

import { isPackageInstalled } from '@tool/is-package-installed/index.js';
import { isFileExists } from '@tool/is-file-exists/index.js';
import { ExtParser } from '@tool/ext-parser/index.js';
import { TsConfig } from '@tool/ts-config/index.js';
import { TsFlag } from '@tool/ts-flag/index.js';

const tsConfig = TsConfig.load();
const rootDir = path.resolve(tsConfig.cwd, tsConfig.rootDir);
const outDir = path.resolve(tsConfig.cwd, tsConfig.outDir);
let swcConfig: Options;

const tsCache = new Map<string, string>();
const tsFlag = new TsFlag();
export const load: LoadHook = async (url, context, defaultLoad) => {
    if (process.platform === 'win32' && path.isAbsolute(url)) {
        url = pathToFileURL(url).href;
    }

    if (new ExtParser(url).isTs()) {
        tsFlag.markAsParsingSourceCode();
        context.format = 'module';
        let cache = tsCache.get(url);
        if (!cache) {
            if (!swcConfig) {
                swcConfig = tsConfig.toSwcConfig();
                swcConfig.inlineSourcesContent = true;
                swcConfig.outputPath = path.resolve(tsConfig.cwd, tsConfig.outDir);
                swcConfig.sourceMaps = 'inline';
            }

            const localSwcConfig = structuredClone(swcConfig);
            localSwcConfig.sourceFileName = fileURLToPath(url);
            localSwcConfig.filename = localSwcConfig.sourceFileName;

            const original = await defaultLoad(url, context);
            const rawText = (original.source as Buffer).toString('utf-8');
            const result = await transform(rawText, localSwcConfig);

            tsCache.set(url, result.code);
            return {
                format: 'module',
                source: result.code,
                shortCircuit: true
            };
        } else {
            return {
                format: 'module',
                source: cache,
                shortCircuit: true
            };
        }
    } else {
        return defaultLoad(url, context);
    }
}

const aliasCache = new Map<string, string>();
export const resolve: ResolveHook = async (specifier, context, defaultResolve) => {
    if (process.platform === 'win32') {
        if (path.isAbsolute(specifier)) {
            specifier = pathToFileURL(specifier).href;
        }
        
        if (context.parentURL && path.isAbsolute(context.parentURL)) {
            context.parentURL = pathToFileURL(context.parentURL).href;
        }
    }

    const specifierParser = new ExtParser(specifier);
    if (
        typeof context.parentURL === 'string' &&
        !specifierParser.isFileUrl() &&
        !path.isAbsolute(specifier) &&
        !isPackageInstalled(specifier)
    ) {
        const resolvedPath = path.dirname(fileURLToPath(context.parentURL));
        const fullFirstPath = tsFlag.isParsingSourceCode
            ?   path.resolve(resolvedPath, specifierParser.toTs())
            :   path.resolve(resolvedPath, specifierParser.toJs());

        if (await isFileExists(fullFirstPath)) {
            specifier = fullFirstPath;
        } else if (!aliasCache.has(specifier)) {
            const fullPaths = tsConfig.resolveAll(specifier);

            // Check if the full resolved path exists
            for (const fullPath of fullPaths) {
                if (tsFlag.isParsingSourceCode) {
                    const fullPathSpecifier = new ExtParser(fullPath).toTs();
                    if (await isFileExists(fullPathSpecifier)) {
                        aliasCache.set(specifier, fullPathSpecifier);
                        specifier = fullPathSpecifier;
                        break;
                    }
                } else {
                    const fullOutPath = fullPath.replace(rootDir, outDir);
                    const fullPathSpecifier = new ExtParser(fullOutPath).toJs();
                    if (await isFileExists(fullPathSpecifier)) {
                        aliasCache.set(specifier, fullPathSpecifier);
                        specifier = fullPathSpecifier;
                        break;
                    }
                }
            }
            
        } else {
            // Get alias from cache
            specifier = aliasCache.get(specifier)!;

        }
    }

    return defaultResolve(specifier, context);
}