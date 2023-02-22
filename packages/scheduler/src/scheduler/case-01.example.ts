import type { DiaryWritterLike, TaskClass } from '../interfaces/index.js';

import { Task } from '../task.js';
import { DateRef } from '../date-ref.js';

export class TaskExample extends Task {
    static #count = 0;
    static get count(): number {
        return TaskExample.#count;
    }

    static reset(): void {
        TaskExample.#count = 0;
    }

    launch() {
        if (++TaskExample.#count >= 3) {
            this.scheduler.stop();
        }
    }
}

export class DiaryFake implements DiaryWritterLike {
    exists(): Promise<boolean> {
        return Promise.resolve(true);
    }

    writeFile(_: any): Promise<void> {
        throw new Error('Method not implemented.');
    }

    loadFile(classes: TaskClass[]): Promise<Map<string, TaskClass[]>> {
        const map = new Map<string, TaskClass[]>();
        const now = new DateRef();

        map.set(now.copy().add('ss', 1).toString(), classes);
        map.set(now.copy().add('ss', 2).toString(), classes);
        map.set(now.copy().add('ss', 3).toString(), classes);

        return Promise.resolve(map);
    }
}