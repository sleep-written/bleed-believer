import { Commander } from '@bleed-believer/commander';
import { AppRouting } from './app.routing.js';

try {
    const cmd = new Commander(AppRouting);
    await cmd.execute();
} catch (err: any) {
    console.error(err);
}