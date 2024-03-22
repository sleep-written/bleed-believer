import type { TaskLaunchOptions, ScheduledTask, TaskClass } from './interfaces/index.js';
import { TaskQueue } from '../task-queue/index.js';

/**
 * Manages the launching of tasks based on scheduled times or infinitely.
 * Utilizes TaskQueue for handling task executions sequentially and provides
 * functionality to abort running tasks.
 */
export class TaskLauncher {
    /**
     * A callback function to handle errors encountered during task execution.
     * @private
     */
    #onErrorFn: (err: any) => void;

    /**
     * A collection of promises representing the currently running tasks.
     * @private
     */
    #runningPromises: Promise<void>[] = [];

    /**
     * A collection of resolver functions to be called upon aborting the tasks.
     * @private
     */
    #abortResolvers: (() => void)[] = [];

    /**
     * A record of tasks and their associated queues.
     * @private
     */
    #tasks: Record<string, {
        task: TaskClass;
        queue: TaskQueue;
    }> = {};

    /**
     * Indicates whether there are any running tasks.
     */
    get isRunning(): boolean {
        return this.#runningPromises.length > 0;
    }

    /**
     * Returns a list of all tasks managed by the TaskLauncher.
     */
    get tasks(): TaskClass[] {
        return Object
            .values(this.#tasks)
            .map(({ task }) => task);
    }

    /**
     * Initializes the TaskLauncher with a set of tasks and an optional error handling function.
     * @param tasks An array of TaskClass instances.
     * @param onErrorFn An optional function to handle errors. Defaults to console.error.
     */
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
     * __YA ES HORA????? *gif de mona china del pandero...*__
     * 
     * Determines whether it is time to run scheduled tasks based on the current time.
     * @param scheduledTasks An array of scheduled tasks to check against.
     * @returns True if it's time to run any of the scheduled tasks; otherwise, false.
     * @private
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

            const foundTime = timestamps.some(([ hh, mm = 0, ss = 0 ]) => (
                (hh === hhNow) &&
                (mm === mmNow) &&
                (ss === ssNow)
            ));

            if (foundTime) {
                return true;
            }
        }

        return false;
    }

    /**
     * Continuously runs a task indefinitely until aborted.
     * @param task The task class to instantiate and run.
     * @param queue The TaskQueue to use for executing the task.
     * @private
     */
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

    /**
     * Runs a task based on a schedule until aborted.
     * @param task The task class to instantiate and run.
     * @param queue The TaskQueue to use for executing the task.
     * @param options The scheduling options for when the task should run.
     * @private
     */
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

    /**
     * Executes the tasks based on the provided launch options.
     * @param options A record of task names to their launch options (infinite or scheduled).
     * @throws Error if there are already running tasks.
     */
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

    /**
     * Aborts all currently running tasks. If no tasks are running, resolves immediately.
     * @returns A promise that resolves when all tasks have been aborted.
     */
    abort(): Promise<void> {
        if (this.isRunning) {
            return new Promise<void>(r => this.#abortResolvers.push(r));
        } else {
            return Promise.resolve();
        }
    }
}
