import { fileURLToPath, pathToFileURL } from 'url';
import { spawn } from 'child_process';
import { join } from 'path';
import { logger, separator } from '@/logger.js';

export class NodeLauncher {
    #loaderPath: string;
    #targetPath: string;
    #targetArgs: string[];

    constructor(targetPath: string, targetArgs: string[]) {
        this.#loaderPath = join(fileURLToPath(import.meta.url), '../../../index.js');
        if (process.platform === 'win32') {
            this.#loaderPath = pathToFileURL(this.#loaderPath).href;
        }

        this.#targetPath = targetPath;
        this.#targetArgs = targetArgs;
    }

    initialize(watch?: boolean): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            try {
                logger.info('Starting...⤵');
                separator();

                const args = [
                    '--import',
                    this.#loaderPath,
                    this.#targetPath,
                    ...this.#targetArgs
                ];

                if (watch) {
                    args.unshift('--watch');
                }

                const proc = spawn('node', args, { stdio: 'inherit' });
                proc.on('close', ___ => { resolve(); });
                proc.on('error', err => { reject(err); });

            } catch(err) {
                reject(err);

            }
        })
            .then(() => {
                separator();
                logger.info('Completed! ⤴');
            })
            .catch(e => {
                separator();
                logger.info('Crashed!!! ⤴');    
                return e;
            });
    }
}