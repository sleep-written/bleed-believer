#! /usr/bin/env node
import { spawn } from 'child_process';
import { logger, separator } from './logger.js';

logger.info('Starting... ⤵');
separator();

await new Promise<void>((resolve, reject) => {
    const argv = [
        '--no-warnings',
        '--loader=@bleed-believer/path-alias',
        ...process.argv.slice(2)
    ];
    
    const proc = spawn('node', argv, { stdio: 'inherit' });
    proc.on('close', ___ => resolve());
    proc.on('error', err => reject(err))
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