#! /usr/bin/env node
import { NodeLauncher } from '@tool/node-launcher/index.js';
import { logger } from '@/logger.js';
import { Argv } from '@tool/argv/index.js';

try {
    const argv = new Argv();
    switch (argv.command) {
        case 'start':
        case 'watch': {
            const launcher = new NodeLauncher(
                argv.targetPath,
                argv.targetArgs
            );

            await launcher.initialize(argv.command === 'watch');
            break;
        }

        case 'build': {
            throw new Error('Comando todavía no implementado.');

        }

        default: {
            throw new Error('Comando no válido.');

        }
    }

} catch (err: any) {
    logger.error(err?.message ?? 'Error not identified.');

}