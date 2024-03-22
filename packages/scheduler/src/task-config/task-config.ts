import type { ScheduledTask, TaskLaunchOptions } from '../task-launcher/index.js';
import type { WatchOptions } from './watch-options.js';
import type { FSWatcher } from 'fs';

import { access, readFile, writeFile } from 'fs/promises';
import { Auditor } from 'audit-var';
import { resolve } from 'path';
import { parse } from 'yaml';
import { watch } from 'fs';

import { yamlStringify } from './yaml-stringify.js';

/**
 * Manages the configuration for task scheduling and execution.
 * Supports loading, saving, and watching configuration files for changes.
 */
export class TaskConfig {
    /**
     * The file path of the configuration.
     * @private
     */
    #path: string;

    /**
     * FSWatcher instance for watching file changes.
     * @private
     */
    #watcher?: FSWatcher;

    /**
     * Timer for debouncing the watch callback.
     * @private
     */
    #debounceTimer?: NodeJS.Timeout;
    
    /**
     * Auditor instance for validating scheduled tasks against a schema.
     * @private
     */
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

    /**
     * Gets the file path of the configuration.
     */
    get path(): string {
        return this.#path;
    }

    /**
     * Determines if the configuration file is being watched for changes.
     * @returns True if the configuration file is being watched; otherwise, false.
     */
    isWatching(): boolean {
        return !!this.#watcher;
    }

    /**
     * Initializes a new instance of the TaskConfig class.
     * @param path The file path for the task configuration.
     */
    constructor(path: string) {
        this.#path = resolve(path);
    }

    /**
     * Checks if the configuration file exists.
     * @returns A promise that resolves to true if the file exists; otherwise, false.
     */
    async exists(): Promise<boolean> {
        try {
            await access(this.#path);
            return true;
        } catch  {
            return false;
        }
    }

    /**
     * Loads the task configuration from the file.
     * @returns A promise that resolves to the loaded task launch options.
     * @throws Error if the file is invalid or cannot be parsed.
     */
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

    /**
     * Saves the provided task launch options to the configuration file.
     * @param v The task launch options to save.
     */
    async save(v: TaskLaunchOptions): Promise<void> {
        const text = yamlStringify(v);
        await writeFile(this.#path, text);
    }

    /**
     * Generates a default task configuration file with the provided task names.
     * @param taskNames An array of task names to include in the configuration.
     */
    generate(taskNames: string[]) {
        const entries = taskNames.map(key => [
                key,
                [{
                    days: [ 1, 2, 3, 4, 5 ],
                    timestamps: [
                        [ 0, 0, 0 ]
                    ]
                }] as ScheduledTask[]
            ]
        );

        const object = Object.fromEntries(entries);
        return this.save(object);
    }

    /**
     * Starts watching the configuration file for changes and applies the provided options.
     * @param options Options for how changes to the configuration file should be handled.
     */
    watch(options: WatchOptions): void {
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

    /**
     * Emits a change event manually for the configuration file watcher.
     */
    emit(): void {
        this.#watcher?.emit('change');
    }

    /**
     * Stops watching the configuration file and cleans up resources.
     */
    unwatch(): void {
        if (this.#debounceTimer) {
            clearTimeout(this.#debounceTimer);
            this.#debounceTimer = undefined;
        }
        this.#watcher?.close();
        this.#watcher = undefined;
    }
}
