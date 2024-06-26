import type { TaskClass, TaskLaunchOptions } from '../task-launcher/index.js';
import type { SchedulerOptions } from './scheduler-options.js';

import { ExecutionMode } from './execution-mode.js';
import { TaskLauncher } from '../task-launcher/index.js';
import { TaskConfig } from '../index.js';
import { basename } from 'path';

/**
 * Orchestrates the scheduling and execution of tasks according to a specified or default configuration.
 * Listens for changes to the configuration file to reload and apply new settings automatically.
 */
export class Scheduler {
    /**
     * A function called when the configuration file changes.
     * @private
     */
    #onConfigChanges: (path: string) => void;

    /**
     * A function called to abort all running tasks.
     * @private
     */
    #onAbortTasks: () => void;

    /**
     * A function called when a task encounters an error.
     * @private
     */
    #onTaskError: (s: Error) => void;

    /**
     * Resolver for the running promise, allowing the scheduler to be gracefully stopped.
     * @private
     */
    #runningResolver?: () => void;

    /**
     * Indicates whether an abort operation has been requested to prevent repeated abort calls.
     * @private
     */
    #abortRequested = false;

    /**
     * The task launcher used to manage task execution.
     * @private
     */
    #launcher: TaskLauncher;

    /**
     * The task configuration manager.
     * @private
     */
    #config: TaskConfig;

    /**
     * Initializes a new Scheduler instance with either an array of TaskClass instances and an optional
     * verbose flag, or SchedulerOptions.
     * @param options Configuration options for the scheduler or an array of task classes.
     * @param verbose Optional flag indicating whether verbose logging should be enabled.
     */
    constructor(options: SchedulerOptions);
    constructor(tasks: TaskClass[], verbose?: boolean);
    constructor(
        ...[ o, verbose ]:
            [ TaskClass[], boolean? ] |
            [ SchedulerOptions | never ]
    ) {
        const isArray = o instanceof Array;
        this.#onConfigChanges = this.#setFunction(
            !isArray ? o.onConfigChanges : verbose,
            path => {
                console.log(`[SCHEDULER]------------------------------------------`);
                console.log(`The file "${basename(path)}" has change, reloading...`);
                console.log(`-----------------------------------------------------`);
            }
        );

        this.#onAbortTasks = this.#setFunction(
            !isArray ? o.onAbortTasks : verbose,
            () => {
                const print = () => {
                    console.log(`[SCHEDULER]------------------------------------------`);
                    console.log(`Stopping all pending tasks...`);
                    console.log(`-----------------------------------------------------`);
                };

                if (process.stdout.cursorTo) {
                    process.stdout.cursorTo(0, undefined, () => print());
                } else {
                    print();
                }
            }
        );

        this.#onTaskError = this.#setFunction(
            !isArray ? o.onTaskError : verbose,
            err => {
                console.log(`[SCHEDULER]------------------------------------------`);
                console.log(err);
                console.log(`-----------------------------------------------------`);
            }
        );
        
        let configPath = './scheduler.yml';
        if (!isArray && typeof o.configPath === 'string') {
            configPath = o.configPath;
        }

        this.#config = new TaskConfig(configPath);
        this.#launcher = new TaskLauncher(isArray ? o : o.tasks, this.#onTaskError);
    }

    /**
     * Selects the appropriate function based on the provided input, with a fallback to a no-operation function.
     * @param input The provided function, a truthy value to use the default function, or undefined.
     * @param defaultFn The default function to be used if the input is truthy or undefined.
     * @returns The selected function to be used for handling events or callbacks.
     * @private
     */
    #setFunction<F extends Function>(input: undefined | boolean | F, defaultFn: F): F {
        if (typeof input === 'function') {
            return input;
        } else if (input) {
            return defaultFn;
        } else {
            return (() => {}) as any;
        }
    }

    /**
     * Checks for the existence of the scheduler's configuration file.
     * @returns A promise that resolves to true if the configuration file exists, false otherwise.
     */
    configExists(): Promise<boolean> {
        return this.#config.exists();
    }

    /**
     * Generates a new configuration file or saves the provided configuration for the scheduler.
     * @param configuration Optional configuration object to be saved. If not provided, a default
     * configuration is generated based on the tasks.
     * @returns A promise that resolves once the configuration has been generated or saved.
     */
    generate(configuration?: TaskLaunchOptions): Promise<void> {
        const names = this.#launcher.tasks.map(x => x.name);
        if (!configuration) {
            return this.#config.generate(names);
        } else {
            return this.#config.save(configuration);
        }
    }

    /**
     * Begins executing the scheduled tasks according to the configuration file.
     * Sets up a watcher on the configuration file to dynamically apply changes.
     * @throws Error if the scheduler is already running.
     */
    async execute(): Promise<void> {
        if (this.#runningResolver) {
            throw new Error('The Scheduler is already running');
        }

        return new Promise<void>((resolve, reject) => {
            this.#runningResolver = resolve;
            this.#config.watch({
                emitAfterLink: true,
                debounce: 250,
                callback: async (content) => {
                    if (this.#launcher.isRunning) {
                        this.#onConfigChanges(this.#config.path);
                        await this.#launcher.abort();
                    }
            
                    return this.#launcher.execute(content);
                },
                onFail: async (err) => {
                    if (this.#launcher.isRunning) {
                        this.#onConfigChanges(this.#config.path);
                        await this.#launcher.abort();
                    }

                    this.#config?.unwatch();
                    reject(err);
                },
            });
        });
    }

    /**
     * Executes specified tasks immediately, either in serial or parallel execution mode. This method filters tasks by their names if provided, otherwise attempts to execute all configured tasks.
     * In serial mode, tasks are executed one after the other, waiting for each task to complete before starting the next.
     * In parallel mode, all filtered tasks are started at the same time, and the method waits for all to complete.
     * If no tasks match the provided names, an error is thrown.
     * @param mode The execution mode: 'serial' or 'parallel'. Determines how tasks are executed relative to each other.
     * @param names Optional names of tasks to execute. If no names are provided, all tasks are executed.
     * @throws Error if no tasks are found that match the provided names or if the mode is invalid.
     */
    async executeNow(mode: ExecutionMode, ...names: string[]): Promise<void> {
        const tasks = this.#launcher.tasks.filter(x => {
                if (names.length > 0) {
                    return names.some(y => y === x.name);
                } else {
                    return true;
                }
            });

        if (tasks.length === 0) {
            throw new Error('No tasks found to execute');
        }

        switch (mode) {
            case 'serial': {
                for (const task of tasks) {
                    try {
                        const o = new task();
                        await o.action();
                    } catch (err: any) {
                        this.#onTaskError(err);
                    }
                }
                break;
            }

            case 'parallel': {
                const promises = tasks
                    .map(async x => {
                        try {
                            const o = new x();
                            await o.action();
                        } catch (err: any) {
                            this.#onTaskError(err);
                        }
                    });

                await Promise.all(promises);
                break;
            }

            default: {
                throw new Error(`Mode "${mode}" is invalid.`);
            }
        }
    }

    /**
     * Gracefully aborts all running tasks and stops the scheduler.
     */
    async abort(): Promise<void> {
        if (
            this.#runningResolver &&
            !this.#abortRequested
        ) {
            this.#abortRequested = true;
            this.#onAbortTasks();

            await this.#launcher.abort();
            this.#config?.unwatch();
            this.#runningResolver();

            this.#runningResolver = undefined;
            this.#abortRequested = false;
        }
    }
}