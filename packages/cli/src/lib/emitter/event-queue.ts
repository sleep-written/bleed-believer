import { EventEmitter } from './event-emitter.js';

export class EventQueue<P extends any[] = []> extends EventEmitter<P> {
    #queue: P[] = [];
    #promise?: Promise<void>;

    // #isRunning = false;
    get isRunning(): boolean {
        return !!this.#promise;
    }

    async #loopEvent(): Promise<void> {
        if (this.#promise) {
            return;
        }

        while (this.#queue.length > 0) {
            const args = this.#queue.shift()!;
            for (const { callback, once } of this.toArray()) {
                try {
                    if (once) {
                        this.off(callback);
                    }

                    await callback(...args);
                } catch (err) {
                    console.error(err);
                }
            }
        }

        this.#promise = undefined;
    }

    override emit(...args: P): Promise<void> {
        this.#queue.push(args);
        if (this.#promise) {
            return this.#promise;
        }

        const promise = this.#loopEvent();
        this.#promise = promise;
        return promise;
    }
}