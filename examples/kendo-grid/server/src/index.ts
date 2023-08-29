import { Commander } from '@bleed-believer/commander';

import { AppRouting } from './app.routing.js';
import npmlog from 'npmlog';

try {
    npmlog.info('app', 'initializing app...');
    const app = new Commander(AppRouting);
    await app.execute();
    npmlog.info('app', 'Execution completed!');
} catch (err: any) {
    npmlog.error('app', err?.message ?? '');
}