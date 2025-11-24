import type { TSConfigObject, Diff, CacheLoadInject } from './interfaces/index.js';
import type { EventCallback } from '@lib/emitter/index.js';

import { EventQueue, EventSubscription } from '@lib/emitter/index.js';
import { Sleepyhead } from './sleepyhead.js';
import { Cache } from './cache.js';

export class Watch {
    #sleepyhead: Sleepyhead;
    #tsConfig: TSConfigObject;

    #controller = new AbortController();
    #changes = new EventQueue<[Diff]>();
    #cache = new Cache();

    #inject?: CacheLoadInject;
    #task?: Promise<void>;

    get isRunning(): boolean {
        return !!this.#task && !this.#controller.signal.aborted;
    }

    get aborted(): boolean {
        return this.#controller.signal.aborted;
    }

    constructor(
        intervalMs: number,
        tsConfig: TSConfigObject,
        inject?: CacheLoadInject
    ) {
        this.#sleepyhead = new Sleepyhead(intervalMs);
        this.#tsConfig = tsConfig;
        this.#inject = inject;
    }

    async #initialize() {
        this.#controller = new AbortController();
        const signal = this.#controller.signal;
        while (!signal.aborted) {
            this.#sleepyhead.reset();
            const sourceCode = this.#tsConfig.getSourceCode();
            const incoming = await Cache.load(sourceCode, this.#inject);
            const diff = this.#cache.update(incoming);
            if (
                diff.created.length > 0 ||
                diff.updated.length > 0 ||
                diff.deleted.length > 0
            ) {
                await this.#changes.emit(diff);
            }

            await this.#sleepyhead.sleep();
        }

        this.#task = undefined;
    }

    on(callback: EventCallback<[ Diff ]>): EventSubscription<[ Diff ]> {
        return this.#changes.on(callback);
    }

    once(callback: EventCallback<[ Diff ]>): EventSubscription<[ Diff ]> {
        return this.#changes.once(callback);
    }

    off(callback: EventCallback<[ Diff ]>): void {
        this.#changes.off(callback);
    }

    async initialize(): Promise<void> {
        if (!this.#task) {
            this.#task = this.#initialize();
        }

        return this.#task;
    }

    abort(): void {
        this.#controller.abort();
    }
}