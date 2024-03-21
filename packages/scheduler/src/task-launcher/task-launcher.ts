import type { TaskLaunchOptions, ScheduledTask, TaskClass } from './interfaces/index.js';
import { TaskQueue } from '../task-queue/index.js';

export class TaskLauncher {
    #onErrorFn: (err: any) => void;

    #runningPromises: Promise<void>[] = [];
    #abortResolvers: (() => void)[] = [];
    #tasks: Record<string, {
        task: TaskClass;
        queue: TaskQueue;
    }> = {};

    get isRunning(): boolean {
        return this.#runningPromises.length > 0;
    }

    get tasks(): TaskClass[] {
        return Object
            .values(this.#tasks)
            .map(({ task }) => task);
    }

    constructor(
        tasks: TaskClass[],
        onErrorFn?: (err: any) => void
    ) {
        for (const task of tasks) {
            this.#tasks[task.name] = {
                task: task,
                queue: new TaskQueue()
            };
        }

        this.#onErrorFn = onErrorFn ?? console.error;
    }

    /**
     * YA ES HORA????? *gif de mona china del pandero...*
     */
    #yaEsHora(scheduledTasks: ScheduledTask[]): boolean {
        const now = new Date();
        const dayNow = now.getDay();
        const hhNow = now.getHours();
        const mmNow = now.getMinutes();
        const ssNow = now.getSeconds();

        for (const { days, timestamps } of scheduledTasks) {
            const foundDay = days.some(x => x === dayNow);
            if (!foundDay) {
                continue;
            }

            const foundTime = timestamps.some(([ hh, mm, ss ]) => (
                (hh === hhNow) &&
                ((mm ?? 0) === mmNow) &&
                ((ss ?? 0) === ssNow)
            ));

            if (foundDay && foundTime) {
                return true;
            }
        }

        return false;
    }

    async #infiniteLoop(
        task: TaskClass,
        queue: TaskQueue
    ): Promise<void> {
        while (this.#abortResolvers.length === 0) {
            const o = new task();
            await queue
                .run(o.action.bind(o))
                .catch(x => this.#onErrorFn(x));
        }
    }

    async #scheduledLoop(
        task: TaskClass,
        queue: TaskQueue,
        options: ScheduledTask[]
    ): Promise<void> {
        while (this.#abortResolvers.length === 0) {
            if (this.#yaEsHora(options)) {
                const o = new task();
                queue
                    .run(o.action.bind(o))
                    .catch(x => this.#onErrorFn(x));
            }
            
            await new Promise(r => setTimeout(r, 1000));
        }
    }

    async execute(options: TaskLaunchOptions): Promise<void> {
        if (this.#runningPromises.length > 0) {
            throw new Error('First abort the current tasks before to rerun');
        }

        for (const [ key, value ] of Object.entries(options)) {
            if (this.#tasks[key]) {
                const { task, queue } = this.#tasks[key];
                this.#runningPromises.push(value === 'infinite'
                    ?   this.#infiniteLoop(task, queue)
                    :   this.#scheduledLoop(task, queue, value)
                );
            }
        }

        await Promise.all(this.#runningPromises);
        this.#runningPromises = [];

        this.#abortResolvers.forEach(resolve => resolve());
        this.#abortResolvers = [];
    }

    abort(): Promise<void> {
        return new Promise<void>(r => this.#abortResolvers.push(r));
    }
}
