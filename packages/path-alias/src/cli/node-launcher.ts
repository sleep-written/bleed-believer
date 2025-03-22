import type { Argv, ArgvData } from '@bleed-believer/commander';

import { fileURLToPath, pathToFileURL } from 'url';
import { GetArgv, getArgvData } from '@bleed-believer/commander';
import { spawn } from 'child_process';
import { join } from 'path';

import { logger, separator } from '@/logger.js';

export class NodeLauncher {
    @GetArgv()
    declare argv: Argv;

    @getArgvData()
    declare argvData: ArgvData;

    #watch: boolean;
    get watch(): boolean {
        return this.#watch;
    }

    constructor(watch?: boolean) {
        this.#watch = !!watch;
    }

    async initialize(): Promise<void> {
        logger.info('Starting... ⤵');
        separator();

        // Getting the loader path
        let loaderPath = join(fileURLToPath(import.meta.url), '../../index.js');
        if (process.platform === 'win32') {
            loaderPath = pathToFileURL(loaderPath).href;
        }
        
        // Execute the program as a child process
        await new Promise<void>((resolve, reject) => {
            try {
                const version = parseInt(
                    process.version.match(/(?<=^v)[0-9]+/gi) as any ?? '0'
                );

                const env: NodeJS.ProcessEnv = {
                    ... process.env,
                    'BLEED_BELIEVER_PATH_ALIAS_ARGS': JSON.stringify(this.argv.flags)
                };
                let argv: string[] = [];
                if (version >= 20) {
                    if (this.#watch) {
                        argv.push('--watch');
                    }

                    argv.push(
                        `--import`,
                        loaderPath
                    );
                    
                    for (let i = 3; i < process.argv.length; i++) {
                        const arg = process.argv[i];
                        
                        if (arg.startsWith('--bb-')) {
                            // Skip over this flag --bb-* argument and its values so the Node process
                            // never receives them.
                            i += this.argv.flags[arg].length;
                            continue;
                        }
                        
                        argv.push(arg);
                    }
                } else {
                    throw new Error('Node version not supported');
                }

                const proc = spawn('node', argv, { stdio: 'inherit', env });
                proc.on('close', ___ => { resolve(); });
                proc.on('error', err => { reject(err); });
            } catch (err) {
                reject(err);
            }
        })
            .then(_ => {
                separator();
                logger.info('Completed!  ⤴');
            })
            .catch(err => {
                separator();
                logger.error('Crashed!   ⤴');
                return err;
            });
    }
}