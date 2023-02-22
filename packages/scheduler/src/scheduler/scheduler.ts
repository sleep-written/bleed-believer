import type { DiaryWritterLike, TaskClass } from '../interfaces/index.js';

import { DateRef } from '../date-ref.js';
import { DiaryWritter } from '../diary-writter.js';
import { SerialTasker } from '../serial-tasker/serial-tasker.js';

export class Scheduler {
    #diaryWritter: DiaryWritterLike;
    #classes: TaskClass[];
    #serial = new SerialTasker();

    #beforeEach:   ((x: { name: string }) => void)[] = [];
    #afterEach:    ((x: { name: string }) => void)[] = [];

    #resolver?: () => void;
    #clock?: NodeJS.Timer;
    get isRunning(): boolean {
        return !!this.#clock;
    }

    constructor(
        classes: TaskClass[],
        diaryWritter?: DiaryWritterLike
    ) {
        this.#classes = classes;
        this.#diaryWritter = diaryWritter ?? new DiaryWritter('./scheduler.yml');
    }

    exists(): Promise<boolean> {
        return this.#diaryWritter.exists();
    }

    createConfig(): Promise<void> {
        return this.#diaryWritter.writeFile(this.#classes);
    }

    stop(): void {
        if (this.#clock) {
            clearInterval(this.#clock);
            this.#clock = undefined;

            if (this.#resolver) {
                this.#resolver();
                this.#resolver = undefined;
            }
        }
    }

    onBeforeEach(callback: (x: { name: string }) => void): void {
        this.#beforeEach.push(callback);
    }

    onAfterEach(callback: (x: { name: string }) => void): void {
        this.#afterEach.push(callback);
    }

    offBeforeEach(callback: (x: { name: string }) => void): void {
        const i = this.#beforeEach.findIndex(x => x === callback);
        if (i >= 0) {
            this.#beforeEach.splice(i, 1);
        }
    }

    offAfterEach(callback: (x: { name: string }) => void): void {
        const i = this.#afterEach.findIndex(x => x === callback);
        if (i >= 0) {
            this.#afterEach.splice(i, 1);
        }
    }

    #callback(dict: Map<string, TaskClass[]>): void {
        const now = new DateRef();
        const tasks = dict.get(now.toString());
        if (tasks) {
            for (const task of tasks) {
                this.#serial.push(async () => {
                    try {
                        this.#beforeEach.forEach(fn => fn(task));

                        const instance = new task(this);
                        await instance.launch();

                        this.#afterEach.forEach(fn => fn(task));
                    } catch (err: any) {
                        console.error(err);
                    }
                });
            }
        }
    }

    async run(ready?: () => void): Promise<void> {
        if (this.#clock) {
            throw new Error('This scheduler instance is already running');
        }
        
        const dict = await this.#diaryWritter.loadFile(this.#classes);
        this.#callback(dict);

        return new Promise((resolve, reject) => {
            this.#resolver = resolve;
            this.#clock = setInterval(
                () => {
                    try {
                        this.#callback(dict);
                    } catch (err) {
                        this.#resolver = undefined;
                        clearInterval(this.#clock);
                        reject(err);
                    }
                },
                1000
            );

            if (ready) {
                ready();
            }
        });
    }

    async runNow(): Promise<void> {
        for (const target of this.#classes) {
            this.#beforeEach.forEach(fn => fn(target));

            const obj = new target(this);
            await obj.launch();

            this.#afterEach.forEach(fn => fn(target)); 
        }
    }
}