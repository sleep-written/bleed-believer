import type { Task } from '../task.js';

export interface TaskClass {
    new(...args: []): Task;
    name: string;
}
