import type { DiaryWritterLike, TaskClass } from '../interfaces/index.js';

import { Task } from '../task.js';
import { DateRef } from '../date-ref.js';

export const queue: number[] = [];

export class TaskBase extends Task {
    launch(): void {
        if (queue.length >= 5) {
            this.scheduler.stop();
        }
    }
}

export class Task01 extends TaskBase {
    launch(): void {
        queue.push(1);
        super.launch();
    }
}

export class Task02 extends TaskBase {
    launch(): void {
        queue.push(2);
        super.launch();
    }
}

export class Task03 extends TaskBase {
    launch(): void {
        queue.push(3);
        super.launch();
    }
}

export class DiaryFake implements DiaryWritterLike {
    loadFile(): Promise<Map<string, TaskClass[]>> {
        const map = new Map<string, TaskClass[]>();
        const now = new DateRef();

        map.set(now.copy().add('ss', 1).toString(), [Task01]);
        map.set(now.copy().add('ss', 2).toString(), [Task02]);
        map.set(now.copy().add('ss', 3).toString(), [Task03]);
        map.set(now.copy().add('ss', 4).toString(), [Task02]);
        map.set(now.copy().add('ss', 5).toString(), [Task01]);

        return Promise.resolve(map);
    }
}