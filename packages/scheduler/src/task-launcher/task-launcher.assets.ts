import type { Task, Timestamp, ScheduledTask } from './interfaces/index.js';

export function createTask(actionFn: () => Promise<void>): { new(): Task } {
    return class implements Task {
        async action(): Promise<void> {
            await actionFn();
        }
    };
}

export function generateSchedule(offset: number): ScheduledTask;
export function generateSchedule(offset: number, ...moreOffsets: number[]): ScheduledTask;
export function generateSchedule(...offsets: [ number, ...number[] ]): ScheduledTask {
    const now = new Date();
    const days: number[] = [];
    const timestamps = offsets.map(ms => {
        const date = new Date(now.getTime() + ms);
        const day = date.getDay();
        if (!days.some(x => x === day)) {
            days.push(day);
        }

        return [
            date.getHours(),
            date.getMinutes(),
            date.getSeconds(),
        ] as Timestamp;
    });

    return { days, timestamps };
}