import type { SleepyheadInject } from './interfaces/index.js';
import { setTimeout } from 'timers/promises';

export class Sleepyhead {
    #timestamp: number;
    #inject: Required<SleepyheadInject>;
    #ms: number;

    constructor(ms: number, inject?: SleepyheadInject) {
        this.#inject = {
            setTimeout: inject?.setTimeout?.bind(inject) ?? setTimeout,
            date:       inject?.date ?? Date
        };

        this.#timestamp = this.#inject.date.now();
        this.#ms = ms;
    }

    async sleep(): Promise<void> {
        const diff = this.#inject.date.now() - this.#timestamp;
        if (diff < this.#ms) {
            const time = this.#ms - diff;
            await this.#inject.setTimeout(time);
        }
    }

    reset(): void {
        this.#timestamp = this.#inject.date.now();
    }
}