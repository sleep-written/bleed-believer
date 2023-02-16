import type { DiaryWritterLike, TaskClass } from '../interfaces/index.js';

import { DateRef } from '../date-ref.js';
import { DiaryWritter } from '../diary-writter.js';
import { SerialTasker } from '../serial-tasker/serial-tasker.js';

export class Scheduler {
    #serial = new SerialTasker();
    #classes: TaskClass[];
    #diaryWritter: DiaryWritterLike;

    #isRunning = false;
    get isRunning(): boolean {
        return this.#isRunning;
    }

    constructor(
        classes: TaskClass[],
        diaryWritter?: DiaryWritterLike
    ) {
        this.#classes = classes;
        this.#diaryWritter = diaryWritter ?? new DiaryWritter('./scheduler.yml');
    }

    stop(): void {
        this.#isRunning = false;
    }

    async run(): Promise<void> {
        if (this.#isRunning) {
            throw new Error('This scheduler instance is already running');
        } else {
            this.#isRunning = true;
        }

        const dict = await this.#diaryWritter.loadFile(this.#classes);
        while (this.#isRunning) {
            const now = new DateRef();
            const tasks = dict.get(now.toString());
            if (tasks) {
                for (const task of tasks) {
                    this.#serial.push(async () => {
                        try {
                            const instance = new task(this);
                            await instance.launch();
                        } catch (err: any) {
                            console.error(err);
                        }
                    });
                }
            }

            await new Promise(r => setTimeout(r, 1000));
        }
    }
}