import type { LoadHook, ResolveHook, SourceMapPayload } from 'module';
import type { Options } from '@swc/core';

import { fileURLToPath } from 'url';
import { transform } from '@swc/core';
import path from 'path';

import { isPackageInstalled } from '@tool/is-package-installed/index.js';
import { isFileExists } from '@tool/is-file-exists/index.js';
import { ExtParser } from '@tool/ext-parser/index.js';
import { TsConfig } from '@tool/ts-config/index.js';
import { TsFlag } from '@tool/ts-flag/index.js';
import { readFile } from 'fs/promises';

const tsConfig = TsConfig.load();
const rootDir = path.resolve(tsConfig.cwd, tsConfig.rootDir);
const outDir = path.resolve(tsConfig.cwd, tsConfig.outDir);
let swcConfig: Options;

const tsCache = new Map<string, string>();
const tsFlag = new TsFlag(process.pid.toString());
export const load: LoadHook = async (url, context, defaultLoad) => {
    if (new ExtParser(url).isTs()) {
        tsFlag.markAsParsingSourceCode();
        context.format = 'module';
        let cache = tsCache.get(url);
        if (!cache) {
            if (!swcConfig) {
                swcConfig = tsConfig.toSwcConfig();
                swcConfig.inlineSourcesContent = true;
                swcConfig.outputPath = path.resolve(tsConfig.cwd, tsConfig.outDir);
                swcConfig.sourceMaps = true;
                swcConfig.sourceRoot = '/';
            }

            swcConfig.sourceFileName = path.relative(tsConfig.cwd, fileURLToPath(url));
            swcConfig.filename = swcConfig.sourceFileName;
            swcConfig.caller = { name: path.basename(swcConfig.filename) };

            const original = await defaultLoad(url, context);
            const rawText = (original.source as Buffer).toString('utf-8');
            const result = await transform(rawText, swcConfig);

            let source = result.code;
            if (result.map) {
                const sourceMapJSON = JSON.parse(result.map) as SourceMapPayload;
                delete (sourceMapJSON as any).sourcesContent;

                const sourceMapText = JSON.stringify(sourceMapJSON);
                source += `\n//# sourceMappingURL=data:application/json;base64,`;
                source += Buffer.from(sourceMapText, 'utf-8').toString('base64');
            }

            tsCache.set(url, source);
            return {
                format: 'module',
                source,
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