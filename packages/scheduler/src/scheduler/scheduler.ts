import type { DiaryWritterLike, TaskClass } from '../interfaces/index.js';

import { DateRef } from '../date-ref.js';
import { DiaryWritter } from '../diary-writter.js';
import { SerialTasker } from '../serial-tasker/serial-tasker.js';

export class Scheduler {
    #serial = new SerialTasker();
    #classes: TaskClass[];
    #diaryWritter: DiaryWritterLike;

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

    #callback(dict: Map<string, TaskClass[]>): void {
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
    }

    async run(): Promise<void> {
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
        });
        // while (this.#isRunning) {
        //     const now = new DateRef();
        //     const tasks = dict.get(now.toString());
        //     if (tasks) {
        //         for (const task of tasks) {
        //             this.#serial.push(async () => {
        //                 try {
        //                     const instance = new task(this);
        //                     await instance.launch();
        //                 } catch (err: any) {
        //                     console.error(err);
        //                 }
        //             });
        //         }
        //     }

        //     await new Promise(r => setTimeout(r, 1000));
        // }
    }
}