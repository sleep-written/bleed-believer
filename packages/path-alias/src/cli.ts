#! /usr/bin/env node
import { Commander, CommandNotFoundError } from '@bleed-believer/commander';
import { CLIRouting } from './cli/routing.js';
import { logger } from './logger.js';

try {
    const commander = new Commander(CLIRouting, { lowercase: true });
    await commander.execute();
} catch (err: any) {
    if (err instanceof CommandNotFoundError) {
        logger.error(
                `Command not found. Please use "help" command `
            +   `to see the available commands.`
        );

    } else {
        logger.error(err?.message ?? 'Error not identifier');
    }
}