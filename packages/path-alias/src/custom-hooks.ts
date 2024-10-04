import type { LoadHook, ResolveHook } from 'module';
import { transform } from '@swc/core';

import { fileURLToPath } from 'url';
import path from 'path';

import { isPackageInstalled } from '@tool/is-package-installed/index.js';
import { isFileExists } from '@tool/is-file-exists/index.js';
import { ExtParser } from '@tool/ext-parser/index.js';
import { TsConfig } from '@tool/ts-config/index.js';
import { TsFlag } from '@tool/ts-flag/index.js';

const tsConfig = TsConfig.load();
const tsFlag = new TsFlag(process.pid.toString());
export const load: LoadHook = async (url, context, defaultLoad) => {
    if (new ExtParser(url).isTs()) {
        tsFlag.markAsParsingSourceCode();
        context.format = 'module';

        const result = await defaultLoad(url, context);
        const rawTxt = (result.source as Buffer).toString('utf-8');
        const swccnf = tsConfig.toSwcConfig();
        const source = await transform(rawTxt, swccnf);

        return {
            format: 'module',
            source: source.code
        };
    } else {
        return defaultLoad(url, context);
    }
}

export const resolve: ResolveHook = async (specifier, context, defaultResolve) => {
    const specifierParser = new ExtParser(specifier);
    if (
        !specifierParser.isFileUrl() &&
        !path.isAbsolute(specifier) &&
        !isPackageInstalled(specifier)
    ) {
        if (tsFlag.parsingSourceCode) {
            const basePath = context.parentURL
                ?   path.resolve(fileURLToPath(context.parentURL), '..')
                :   tsConfig.path;
    
            const fullPath = path.join(basePath, specifier);
            if (!await isFileExists(fullPath)) {
                specifier = specifierParser.toTs();
            }
        } else {
            const outDir = path.resolve(tsConfig.outDir);
            const rootDir = path.resolve(tsConfig.rootDir);
            const fullPaths = tsConfig.resolveAll(specifier);
            for (const fullPath of fullPaths) {
                const fullPathJs = new ExtParser(fullPath).toJs();
                const fullOutPath = fullPathJs.replace(rootDir, outDir);
                if (await isFileExists(fullOutPath)) {
                    specifier = fullOutPath;
                    break;
                }
            }
        }
    }

    return defaultResolve(specifier, context);
}