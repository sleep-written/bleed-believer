import type { FileTranspilerInject, TranspilerInject } from './interfaces/index.js';
import type { DirentObject, TSConfig } from '@lib/ts-config/index.js';

import { FileTranspiler } from './file-transpiler.js';
import { logger } from '@/logger.js';
import { Watch } from '@lib/watch/index.js';

import { join } from 'path';
import { rm } from 'fs/promises';
import chalk from 'chalk';

export class Transpiler {
    #fileTranspiler: FileTranspiler;
    #tsConfig: TSConfig;
    #inject: Required<TranspilerInject> & FileTranspilerInject;

    constructor(tsConfig: TSConfig, inject?: TranspilerInject & FileTranspilerInject) {
        this.#tsConfig = tsConfig;
        this.#inject = {
            ...(inject ?? {}),
            rm:         inject?.rm?.bind(inject)    ?? rm,
            chalk:      inject?.chalk               ?? chalk,
            logger:     inject?.logger              ?? logger,
            process:    inject?.process             ?? process
        }

        this.#fileTranspiler = new FileTranspiler(this.#tsConfig, this.#inject);
    }

    #coloredPath(input: string | DirentObject): string {
        const cwd = this.#inject.process.cwd();
        if (typeof input !== 'string') {
            input = join(
                input.parentPath.slice(cwd.length + 1),
                input.name
            );
        } else {
            input = input.slice(cwd.length + 1);
        }

        return this.#inject.chalk.greenBright(`"${input}"`);
    }

    async build(): Promise<void> {
        for await (const file of this.#tsConfig.getSourceCode()) {
            const coloredPath = this.#coloredPath(file);

            try {
                await this.#fileTranspiler.transpile(file);
                this.#inject.logger.info(`File ${coloredPath} transpiled succesfully`);
            } catch (err) {
                this.#inject.logger.error(`File ${coloredPath} transpile has failed:`);
                throw err;
            }
        }
    }
    
    async watch(): Promise<void> {
        const watch = new Watch(250, this.#tsConfig);
        watch.on(async diff => {
            const deleteFiles = diff.deleted.map(x => this.#tsConfig.getOutputPath(x));
            for (const path of deleteFiles) {
                const coloredPath = this.#coloredPath(path);

                try {
                    await this.#inject.rm(path, { force: true });
                    this.#inject.logger.info(`File ${coloredPath} deleted succesfully.`);
                } catch (err) {
                    this.#inject.logger.error(`File ${coloredPath} deletion has failed:\n`, err, '\n');
                }
            }

            for (const path of [ ...diff.created, ...diff.updated ]) {
                const coloredPath = this.#coloredPath(path);

                try {
                    await this.#fileTranspiler.transpile(path);
                    this.#inject.logger.info(`File ${coloredPath} transpiled succesfully.`);
                } catch (err) {
                    this.#inject.logger.error(`File ${coloredPath} transpile has failed:\n`, err, '\n');

                }
            }
        });

        const promise = watch.initialize();
        this.#inject.process.once('SIGINT', () => {
            watch.abort();
            if (watch.isRunning) {
            }
        });

        return promise;
    }
}