import type { ScheduledTask } from './scheduled-task.js';

/**
 * Defines the launch options for tasks.
 * Tasks can either run infinitely or based on a specified schedule.
 */
export type TaskLaunchOptions = Record<string, 'infinite' | ScheduledTask[]>;
