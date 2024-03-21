import { TaskLauncher, type TaskClass } from './task-launcher/index.js';
import { TaskConfig } from './index.js';

export class Scheduler {
    #consoleError: (s: string) => void;
    // #consoleLog: (e: Error) => void;

    #runningPromise?: Promise<void>;
    #launcher: TaskLauncher;
    #config: TaskConfig;

    constructor(
        options: {
            consoleError?: (s: string) => void;
            // consoleLog?: (e: Error) => void;
            tasks: TaskClass[];
            path?: string;
        }
    ) {
        this.#consoleError = options.consoleError ?? console.error;
        // this.#consoleLog = options.consoleLog ?? console.log;

        this.#launcher = new TaskLauncher(options.tasks, this.#consoleError);
        this.#config = new TaskConfig(options.path ?? './scheduler.yml');
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
                        await this.#launcher.abort();
                    }
            
                    return this.#launcher.execute(content);
                },
                onFail: async (err) => {
                    if (this.#launcher.isRunning) {
                        await this.#launcher.abort();
                    }

                    this.#config?.unwatch();
                    reject(err);
                },
            });
    
            process.on('SIGINT', async () => {
                console.log();
                await this.#launcher.abort();
                this.#config?.unwatch();
                resolve();
            });
        }); 
    }
}