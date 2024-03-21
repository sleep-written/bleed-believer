import type { Task } from '../index.js';

import { doomsdayClock } from './tool/doomsday-clock.js';
import { timestamp } from './tool/timestamp.js';

export class Task01 implements Task {
    async action(): Promise<void> {
        timestamp('AjajJAj');
        doomsdayClock(0.1);
        await new Promise(r => setTimeout(r, 1000));
    }
}