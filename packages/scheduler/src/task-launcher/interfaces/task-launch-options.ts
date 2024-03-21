import type { ScheduledTask } from './scheduled-task.js';

export type TaskLaunchOptions = Record<string, 'infinite' | ScheduledTask[]>;