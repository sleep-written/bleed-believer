import type { Task } from '../index.js';

import { doomsdayClock } from './tool/doomsday-clock.js';
import { timestamp } from './tool/timestamp.js';

export class Task02 implements Task {
    async action(): Promise<void> {
        timestamp('LOOOOOOOL');
        doomsdayClock(0.3);
        await new Promise(r => setTimeout(r, 5000));
    }
}