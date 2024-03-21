import type { Task } from './task.js';

export interface TaskClass {
    new(): Task;
}