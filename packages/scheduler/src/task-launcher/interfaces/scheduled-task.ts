import type { Timestamp } from './timestamp.js';

export interface ScheduledTask {
    days: number[];
    timestamps: Timestamp[];
};