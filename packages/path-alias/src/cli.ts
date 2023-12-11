#! /usr/bin/env node
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import { join } from 'path';

import { logger, separator } from './logger.js';

logger.info('Starting... ⤵');
separator();

// Getting the loader path
const loaderPath = join(
    fileURLToPath(import.meta.url),
    '..', 'index.js'
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
                ...process.argv.slice(2)
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
        console.error(err);
    });