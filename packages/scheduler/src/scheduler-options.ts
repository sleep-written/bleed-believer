import type { TaskClass } from './task-launcher/index.js';

export interface SchedulerOptions {
    onConfigChanges?:   boolean | ((path: string) => void);
    onAbortTasks?:      boolean | (() => void);
    onTaskError?:       boolean | ((s: Error) => void);
    configPath?:        string;
    tasks:              TaskClass[];
}