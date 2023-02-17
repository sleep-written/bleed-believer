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
    #now = new DateRef();

    loadFile(classes: TaskClass[]): Promise<Map<string, TaskClass[]>> {
        const map = new Map<string, TaskClass[]>();
        map.set(this.#now.copy().add('ss', 1).toString(), classes);
        map.set(this.#now.copy().add('ss', 2).toString(), classes);
        map.set(this.#now.copy().add('ss', 3).toString(), classes);

        return Promise.resolve(map);
    }
}