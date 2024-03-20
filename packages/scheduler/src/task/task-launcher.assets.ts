import type { TaskLaunchOptions } from './task-launch-options.js';
import type { Task } from './task.js';

export function getNow() {
    const now = new Date();
    return {
        day: now.getDay(),
        hh: now.getHours(),
        mm: now.getMinutes(),
        ss: now.getSeconds(),
    };
}

export function createTask(actionFn: () => Promise<void>): { new(): Task } {
    return class implements Task {
        async action(): Promise<void> {
            await actionFn();
        }
    };
}

export function incrementSeconds(seconds: number, increment: number): [number, number, number] {
    const futureTime = new Date(new Date().getTime() + increment * 1000);
    return [futureTime.getHours(), futureTime.getMinutes(), futureTime.getSeconds()];
}

export function scheduleOptionsForTasks(tasks: string[], offsets: number[][]): Record<string, TaskLaunchOptions> {
    const { day, hh, mm, ss } = getNow();
    let launchOptions: Record<string, TaskLaunchOptions> = {};

    tasks.forEach((task, index) => {
        launchOptions[task] = {
            days: [day],
            timestamp: offsets[index].map(offset => incrementSeconds(ss, offset))
        };
    });

    return launchOptions;
}
