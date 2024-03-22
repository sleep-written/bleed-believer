import type { SchedulerOptions } from './scheduler-options.js';
import type { TaskClass } from './task-launcher/index.js';

import { TaskLauncher } from './task-launcher/index.js';
import { TaskConfig } from './index.js';
import { basename } from 'path';

export class Scheduler {
    #onConfigChanges: (path: string) => void;
    #onAbortTasks: () => void;
    #onTaskError: (s: Error) => void;

    #runningPromise?: Promise<void>;
    #launcher: TaskLauncher;
    #config: TaskConfig;

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
                process.stdout.cursorTo(0, undefined, () => {
                    console.log(`[SCHEDULER]------------------------------------------`);
                    console.log(`Stopping all pending tasks...`);
                    console.log(`-----------------------------------------------------`);
                });
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

    #setFunction<F extends Function>(input: undefined | boolean | F, defaultFn: F): F {
        if (typeof input === 'function') {
            return input;
        } else if (input) {
            return defaultFn;
        } else {
            return (() => {}) as any;
        }
    }

    configExists(): Promise<boolean> {
        return this.#config.exists();
    }

    generate(): Promise<void> {
        const names = this.#launcher.tasks.map(x => x.name);
        return this.#config.generate(names);
    }

    execute(): Promise<void> {
        if (this.#runningPromise) {
            throw new Error('The Scheduler is already running');
        }

        return new Promise<void>((resolve, reject) => {
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
    
            process.on('SIGINT', async () => {
                this.#onAbortTasks();

                await this.#launcher.abort();
                this.#config?.unwatch();
                resolve();
            });
        }); 
    }
}