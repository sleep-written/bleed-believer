import type { ArgvData, Executable } from '@bleed-believer/commander';

import { basename, dirname, isAbsolute, join, relative, resolve,  } from 'path';
import { Command, getArgvData } from '@bleed-believer/commander';
import { mkdir, writeFile } from 'fs/promises';
import { transformFile } from '@swc/core';
import fastGlob from 'fast-glob';

import { logger, separator } from '@/logger.js';
import { ExtParser } from '@tool/ext-parser/index.js';
import { TsConfig } from '@tool/ts-config/index.js';

@Command({
    name: 'Build project',
    path: 'build ...',
    info: 
            `Transpile your project with swc. By default, searchs a `
        +   `"tsconfig.json" in your current working directory. Also `
        +   `you can provide a custom typescript configuration file `
        +   `location if you need it.`
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

        const rootDir = resolve(tsConfig.cwd, tsConfig.rootDir);
        const outDir = resolve(tsConfig.cwd, tsConfig.outDir);

        let globPattern = join(rootDir, '**/*.{ts,mts}');
        if (process.platform === 'win32') {
            globPattern = globPattern.replaceAll('\\', '/');
        }

        const files = await fastGlob([
            globPattern,
            ...(tsConfig?.config?.include ?? [])
        ], {
            dot: true,
            cwd: tsConfig.path,
            ignore: tsConfig?.config?.exclude,
            absolute: true,
            globstar: true,
            onlyFiles: true,
            objectMode: true
        });

        if (files.length === 0) {
            throw new Error('None files detected to transpile to js.');
        }

        const swcConfig = tsConfig.toSwcConfig();
        delete swcConfig.exclude;

        for (const file of files) {
            const rootPath = resolve(file.path);
            const outPath = new ExtParser(rootPath).toJs().replace(rootDir, outDir);

            await this.#mkDir(outPath);
            const localSwcConfig = structuredClone(swcConfig);
            if (localSwcConfig.sourceMaps) {
                localSwcConfig.sourceFileName = relative(dirname(outPath), rootPath);
            }

            logger.info(`Building "${rootPath.replace(tsConfig.cwd, '')}"...`)
            let { code, map } = await transformFile(rootPath, localSwcConfig);

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