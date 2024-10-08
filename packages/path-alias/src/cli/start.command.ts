import type { Argv, ArgvData, Executable } from '@bleed-believer/commander';

import { Command, GetArgv, getArgvData } from '@bleed-believer/commander';
import { logger, separator } from '@/logger.js';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import { join } from 'path';

@Command({
    name: 'Start a program',
    path: 'start ...'
})
export class StartCommand implements Executable {
    @GetArgv()
    declare argv: Argv;

    @getArgvData()
    declare argvData: ArgvData;

    async start(): Promise<void> {
        logger.info('Starting... ⤵');
        separator();

        // Getting the loader path
        const loaderPath = join(
            fileURLToPath(import.meta.url),
            '../..', 'index.js'
        );
        
        // Execute the program as a child process
        await new Promise<void>((resolve, reject) => {
            try {
                const version = parseInt(
                    process.version.match(/(?<=^v)[0-9]+/gi) as any ?? '0'
                );

                let argv: string[];
                if (version >= 20) {
                    argv = [
                        `--import`,
                        loaderPath,
                        ...this.argvData.items
                    ];
                } else {
                    throw new Error('Node version not supported');
                }

                const proc = spawn('node', argv, { stdio: 'inherit' });
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