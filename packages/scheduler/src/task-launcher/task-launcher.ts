import type { TaskLaunchOptions, Task, ScheduledTask } from './interfaces/index.js';
import { TaskQueue } from '../task-queue/index.js';

export class TaskLauncher {
    #runningPromises: Promise<void>[] = [];
    #abortResolvers: (() => void)[] = [];
    #tasks: Record<string, {
        task: { new(): Task; };
        queue: TaskQueue;
    }> = {};

    constructor(tasks: { new(): Task; }[]) {
        for (const task of tasks) {
            this.#tasks[task.name] = {
                task: task,
                queue: new TaskQueue()
            };
        }
    }

    /**
     * YA ES HORA????? *gif de mona china del pandero...*
     */
    #yaEsHora({ days, timestamps }: ScheduledTask): boolean {
        const now = new Date();
        const dayNow = now.getDay();
        const hhNow = now.getHours();
        const mmNow = now.getMinutes();
        const ssNow = now.getSeconds();

        if (!days.some(x => x === dayNow)) {
            return false;
        }
        
        return timestamps.some(([ hh, mm, ss ]) => (
            (hhNow === hh) &&
            (mmNow === mm ?? 0) &&
            (ssNow === ss ?? 0)
        ));
    }

    async #infiniteLoop(
        task: { new(): Task; },
        queue: TaskQueue
    ): Promise<void> {
        while (this.#abortResolvers.length === 0) {
            const o = new task();
            await queue.run(o.action.bind(o));
        }
    }

    async #scheduledLoop(
        task: { new(): Task; },
        queue: TaskQueue,
        options: ScheduledTask
    ): Promise<void> {
        while (this.#abortResolvers.length === 0) {
            if (this.#yaEsHora(options)) {
                const o = new task();
                queue.run(o.action.bind(o));
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
