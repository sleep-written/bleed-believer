#! /usr/bin/env node
import { logger, separator } from '@/logger.js';
import { SWCTranspiler } from '@tool/swc-transpiler/index.js';
import { NodeLauncher } from '@tool/node-launcher/index.js';

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
            // throw new Error('Comando todavía no implementado.');
            const transpiler = new SWCTranspiler(process.argv[3]);
            await transpiler.build();
            break;
        }

        default: {
            throw new Error(`El comando "${command}" no es válido.`);

        }
    }

} catch (err: any) {
    logger.error(err?.message ?? 'Error not identified.');

}