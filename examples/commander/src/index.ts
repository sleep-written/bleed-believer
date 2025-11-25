import { Commander } from '@bleed-believer/commander';

import { AppRouting } from './app.routing.js';
import { logger } from './logger.js';

export const commander = new Commander(AppRouting, {
    lowercase: true
});

try {
    await commander.execute();
} catch (err) {
    logger.error(err);
}