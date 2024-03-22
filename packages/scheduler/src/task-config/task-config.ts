import { access, readFile, writeFile } from 'fs/promises';
import { watch, type FSWatcher } from 'fs';
import { parse, stringify } from 'yaml';
import { resolve } from 'path';
import { Auditor } from 'audit-var';

import type { TaskLaunchOptions } from '../task-launcher/index.js';

export class TaskConfig {
    #path: string;
    #watcher?: FSWatcher;
    #debounceTimer?: NodeJS.Timeout;
    #auditorScheduled = new Auditor({
        type: 'array',
        items: {
            type: 'object',
            keys: {
                days:       {
                    type: 'array',
                    min: 1,
                    items: {
                        type: 'number',
                        min: 0,
                        max: 6
                    }
                },
                timestamps: {
                    type: 'array',
                    min: 1,
                    items: {
                        type:  'array',
                        min: 1,
                        max: 3,
                        items: { type: 'number', min: 0 }
                    }
                },
            }
        }
    });

    get path(): string {
        return this.#path;
    }

    isWatching(): boolean {
        return !!this.#watcher;
    }

    constructor(path: string) {
        this.#path = resolve(path);
    }

    generate(taskNames: string[]) {
        const header = `# TaskLauncher Configuration\n# Each task can be scheduled or set to run 'infinite'.\n\n`;
        const text = taskNames
            .map((name, i) => i === 0
                ?   [
                        `# Task name: ${name}`,
                        `# For scheduled execution, define an array of 'days' and 'timestamps'.`,
                        `# For infinite execution, simply use: ${name}: 'infinite'`,
                        `${name}:`,
                        `  - days: [1, 2, 3, 4, 5] # Monday to Friday`,
                        `    timestamps:`,
                        `      - [9, 0, 0]  # 9:00 AM`,
                        `      - [12, 0, 0] # Noon`,
                        `      - [15, 30, 0] # 3:30 PM`,
                        ``,
                        `  - days: [6, 0] # Saturday and Sunday`,
                        `    timestamps:`,
                        `      - [9, 0, 0]  # 9:00 AM`,
                        `      - [12, 0, 0] # Noon`,
                        `      - [15, 30, 0] # 3:30 PM`,
                    ].join('\n')
                :   [
                        `# Task name: ${name}`,
                        `${name}:`,
                        `  - days: [1, 2, 3, 4, 5] # Monday to Friday`,
                        `    timestamps:`,
                        `      - [0, 0, 0]  # 0:00 AM`,
                    ].join('\n'))
            .join('\n\n');

        return writeFile(this.#path, header + text, 'utf-8');
    }

    async exists(): Promise<boolean> {
        try {
            await access(this.#path);
            return true;
        } catch  {
            return false;
        }
    }

    async load(): Promise<TaskLaunchOptions> {
        const text = await readFile(this.#path, 'utf-8');
        const data = parse(text) as TaskLaunchOptions;

        try {
            if (!data || typeof data !== 'object') {
                throw new Error();
            }

            for (const value of Object.values(data)) {
                if (value !== 'infinite') {
                    this.#auditorScheduled.audit(value);
                }
            }

            return data;
        } catch (err) {
            throw new Error('The file is invalid');
        }
    }

    async save(v: TaskLaunchOptions): Promise<void> {
        const text = stringify(v);
        await writeFile(this.#path, text);
    }

    watch(options: {
        emitAfterLink?: boolean;
        debounce?: number;
        callback: (content: TaskLaunchOptions) => void | Promise<void>,
        onFail: (err: Error) => void | Promise<void>
    }): void {
        if (this.#watcher) {
            throw new Error('Watcher already called');
        }

        this.#watcher = watch(this.#path, async _ => {
            if (this.#debounceTimer) {
                clearTimeout(this.#debounceTimer);
            }

            this.#debounceTimer = setTimeout(async () => {
                try {
                    const data = await this.load();
                    await options.callback(data);
                } catch (err: any) {
                    await options.onFail(err);
                }
            }, options.debounce ?? 250);
        });

        if (options.emitAfterLink) {
            this.#watcher.emit('change');
        }
    }

    emit(): void {
        this.#watcher?.emit('change');
    }

    unwatch(): void {
        if (this.#debounceTimer) {
            clearTimeout(this.#debounceTimer);
            this.#debounceTimer = undefined;
        }
        this.#watcher?.close();
        this.#watcher = undefined;
    }
}
