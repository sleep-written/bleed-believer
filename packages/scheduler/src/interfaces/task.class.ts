import type { Task } from '../task.js';
import type { SchedulerLike } from './scheduler-like.js';

export interface TaskClass {
    new(...args: [ SchedulerLike ]): Task;
    name: string;
}
