import type { ArgvData, Executable } from '@bleed-believer/commander';

import { basename, dirname, isAbsolute, join, resolve } from 'path';
import { Command, getArgvData } from '@bleed-believer/commander';
import { mkdir, writeFile } from 'fs/promises';
import { transformFile } from '@swc/core';
import fastGlob from 'fast-glob';

import { logger, separator } from '@/logger.js';
import { ExtParser } from '@tool/ext-parser/index.js';
import { TsConfig } from '@tool/ts-config/index.js';

@Command({
    name: 'Build project',
    path: 'build ...'
})
export class BuildCommand implements Executable {
    #mkDirCache = new Set<string>();

    @getArgvData()
    declare argvData: ArgvData;

    get tsConfigPath(): string {
        if (this.argvData.items.length > 0) {
            const path = join(...this.argvData.items);
            if (!isAbsolute(path)) {
                return join(process.cwd(), path);
            } else {
                return path;
            }
        } else {
            return join(process.cwd(), 'tsconfig.json');
        }
    }

    async #mkDir(filepath: string): Promise<void> {
        const dir = dirname(filepath);
        if (!this.#mkDirCache.has(dir)) {
            await mkdir(dir, { recursive: true });
            this.#mkDirCache.add(dir);
        }
    }

    async start(): Promise<void> {        
        logger.info('Begin build process...  ⤵');
        separator();

        const tsConfigPath = this.tsConfigPath;
        const tsConfig = TsConfig.load(
            dirname(tsConfigPath),
            basename(tsConfigPath)
        );

        const rootDir = resolve(tsConfig.path, '..', tsConfig.rootDir);
        const outDir = resolve(tsConfig.path, '..', tsConfig.outDir);
        const cwd = resolve(tsConfig.path, '..');

        const files = await fastGlob([
            join(rootDir, '**/*.{ts,mts}'),
            ...(tsConfig?.config?.include ?? [])
        ], {
            dot: true,
            cwd: tsConfig.path,
            ignore: tsConfig?.config?.exclude,
            absolute: true,
            globstar: true,
            onlyFiles: true,
            objectMode: true,
        });

        const swcConfig = tsConfig.toSwcConfig();
        for (const file of files) {
            const rootPath = file.path;
            const outPath = new ExtParser(rootPath).toJs().replace(rootDir, outDir);

            await this.#mkDir(outPath);
            if (swcConfig.sourceMaps) {
                swcConfig.sourceFileName = rootPath;
            }

            logger.info(`Building "${rootPath.replace(cwd, '')}"...`)
            let { code, map } = await transformFile(rootPath, swcConfig);

            if (map && swcConfig.sourceMaps) {
                code = `${code}\n\n//# sourceMappingURL=${basename(outPath)}.map`;
                await writeFile(`${outPath}.map`, map, 'utf-8');
            }

            await writeFile(outPath, code, 'utf-8');
        }

        separator();
        logger.info('Build process complete! ⤴');
    }
}