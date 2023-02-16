import type { SchedulerLike } from './interfaces/index.js';

export abstract class Task {
    constructor(
        protected scheduler: SchedulerLike
    ) {}

    abstract launch(): void | Promise<void>;
}
