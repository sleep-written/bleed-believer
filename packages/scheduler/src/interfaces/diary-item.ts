import type { Day } from './day.js';
import type { Time } from './time.js';

export interface DiaryItem {
    days:           Day[];
    interval?:      Time;
    timestamps?:    Time[];
};
