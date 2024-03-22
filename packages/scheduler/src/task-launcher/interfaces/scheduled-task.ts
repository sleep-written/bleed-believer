import type { Timestamp } from './timestamp.js';

/**
 * Represents a scheduled task with specific days and times for execution.
 */
export interface ScheduledTask {
    /**
     * An array of numbers representing the days of the week when the task should run.
     * Sunday = 0, Monday = 1, ..., Saturday = 6.
     */
    days: number[];

    /**
     * An array of timestamps specifying the times of day when the task should run.
     */
    timestamps: Timestamp[];
};
