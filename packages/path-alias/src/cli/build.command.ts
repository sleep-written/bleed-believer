import type { Executable } from '@bleed-believer/commander';

import { mkdir, readdir, writeFile } from 'fs/promises';
import { dirname, join, resolve } from 'path';
import { transformFile } from '@swc/core';
import { Command } from '@bleed-believer/commander';

import { logger, separator } from '@/logger.js';
import { ExtParser } from '@tool/ext-parser/index.js';
import { TsConfig } from '@tool/ts-config/index.js';

@Command({
    name: 'Build project',
    path: 'build'
})
export class BuildCommand implements Executable {
    async start(): Promise<void> {        
        logger.info('Begin build process...  ⤵');
        separator();

        const workingPath = process.cwd();
        const tsConfig = TsConfig.load();
        const rootDir = resolve(tsConfig.path, '..', tsConfig.rootDir);
        const outDir = resolve(tsConfig.path, '..', tsConfig.outDir);
        const files = await readdir(rootDir, {
            recursive: true,
            withFileTypes: true,
        });

        const swcConfig = tsConfig.toSwcConfig();
        for (const dirent of files) {
            const rootPath = join(dirent.parentPath, dirent.name);
            const outPath = new ExtParser(rootPath).toJs().replace(rootDir, outDir);

            await mkdir(dirname(outPath), { recursive: true });
            if (dirent.isFile()) {
                logger.info(`Building "${rootPath.replace(workingPath, '')}"...`)

                const { code, map } = await transformFile(rootPath, swcConfig);
                await writeFile(outPath, code, 'utf-8');

                if (map) {
                    await writeFile(`${outPath}.map`, map, 'utf-8');
                }
            }
        }

        separator();
        logger.info('Build process complete! ⤴');
    }
}