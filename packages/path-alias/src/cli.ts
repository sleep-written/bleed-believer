#! /usr/bin/env node
import { CLIRouting } from './cli/routing.js';
import { Commander } from '@bleed-believer/commander';
import { logger } from './logger.js';

try {
    const commander = new Commander(CLIRouting, { lowercase: true });
    await commander.execute();
} catch (err: any) {
    logger.error(err?.message ?? 'Error not identifier');
}