import type { TaskLaunchOptions } from '../task-launcher/index.js';

export interface WatchOptions {
    emitAfterLink?: boolean;
    debounce?:      number;
    callback:       (content: TaskLaunchOptions) => void | Promise<void>,
    onFail:         (err: Error) => void | Promise<void>
}