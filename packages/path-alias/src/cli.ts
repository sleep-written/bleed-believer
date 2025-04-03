#! /usr/bin/env node
import { NodeLauncher } from '@tool/node-launcher/index.js';
import { logger, separator } from '@/logger.js';

try {
    const command = process.argv[2]
        ?.trim()
        ?.toLowerCase();

    switch (command) {
        case 'start':
        case 'watch': {
            try {
                logger.info('Starting...⤵');
                separator();

                const launcher = new NodeLauncher(process.argv[3], process.argv.slice(4));
                await launcher.initialize(command === 'watch');
                
                separator();
                logger.info('Completed! ⤴');

            } catch (err) {
                separator();
                logger.info('Crashed!!! ⤴');
                throw err;

            } finally {
                break;

            }
        }

        case 'build': {
            throw new Error('Comando todavía no implementado.');

        }

        default: {
            throw new Error(`El comando "${command}" no es válido.`);

        }
    }

} catch (err: any) {
    logger.error(err?.message ?? 'Error not identified.');

}