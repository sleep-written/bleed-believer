import type { SpawnFunction, ProcessInstance, NodeLauncherInjection } from './interfaces/index.js';

import { fileURLToPath, pathToFileURL } from 'url';
import { isAbsolute, join, resolve } from 'path';
import { spawn } from 'child_process';

export class NodeLauncher {
    static #loaderPath = process.platform === 'win32'
        ?   pathToFileURL(join(fileURLToPath(import.meta.url), '../../../index.js')).href
        :   join(fileURLToPath(import.meta.url), '../../../index.js');

    static get loaderPath() {
        return NodeLauncher.#loaderPath;
    }

    #targetPath: string;
    get targetPath(): string {
        return this.#targetPath;
    }

    #targetArgs: string[];
    get targetArgs(): string[] {
        return this.#targetArgs.slice();
    }

    #process: ProcessInstance;
    #spawn: SpawnFunction;

    constructor(
        targetPath: string,
        targetArgs: string[],
        inject?: Partial<NodeLauncherInjection>
    ) {
        this.#process = inject?.process ?? process;
        this.#spawn = inject?.spawn ?? spawn;

        this.#targetPath = !isAbsolute(targetPath)
            ?   resolve(this.#process.cwd(), targetPath)
            :   targetPath;

        this.#targetArgs = targetArgs;
    }

    initialize(watch?: boolean): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            try {
                const args = [
                    '--import',
                    NodeLauncher.loaderPath,
                    this.#targetPath,
                    ...this.#targetArgs
                ];

                if (watch) {
                    args.unshift('--watch');
                }

                const proc = this.#spawn('node', args, { stdio: 'inherit' });
                proc.on('close', ___ => { resolve(); });
                proc.on('error', err => { reject(err); });

            } catch (err) {
                reject(err);

            }
        });
    }
}