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
                delete swcConfig?.jsc?.baseUrl;
                delete swcConfig?.jsc?.paths;
            }

            swcConfig.sourceFileName = fileURLToPath(url);
            swcConfig.filename = fileURLToPath(url);
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
                shortCircuit: true
            };
        }
    } else {
        return defaultLoad(url, context);
    }
}

const aliasCache = new Map<string, string>();
const rootDir = path.resolve(tsConfig.path, '..', tsConfig.rootDir);
const outDir = path.resolve(tsConfig.path, '..', tsConfig.outDir);
export const resolve: ResolveHook = async (specifier, context, defaultResolve) => {
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