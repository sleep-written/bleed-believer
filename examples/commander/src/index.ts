import { Commander } from '@bleed-believer/commander';

import { AppRouting } from './app.routing.ts';
import { logger } from './logger.ts';

export const commander = new Commander(AppRouting, {
    lowercase: true
});

try {
    await commander.execute();
} catch (err) {
    logger.error(err);
}