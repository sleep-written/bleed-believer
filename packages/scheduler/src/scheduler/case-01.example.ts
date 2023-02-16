import type { DiaryWritterLike, TaskClass } from '../interfaces/index.js';

import { Task } from '../task.js';
import { DateRef } from '../date-ref.js';

export class TaskExample extends Task {
    static #count = 0;
    static get count(): number {
        return TaskExample.#count;
    }

    launch() {
        if (++TaskExample.#count >= 3) {
            this.scheduler.stop();
        }
    }
}

export class DiaryFake implements DiaryWritterLike {
    loadFile(classes: TaskClass[]): Promise<Map<string, TaskClass[]>> {
        const map = new Map<string, TaskClass[]>();
        const now = new DateRef();

        map.set(new DateRef(now.day, now.hours, now.minutes, now.seconds + 1).toString(), classes);
        map.set(new DateRef(now.day, now.hours, now.minutes, now.seconds + 2).toString(), classes);
        map.set(new DateRef(now.day, now.hours, now.minutes, now.seconds + 3).toString(), classes);

        return Promise.resolve(map);
    }
}