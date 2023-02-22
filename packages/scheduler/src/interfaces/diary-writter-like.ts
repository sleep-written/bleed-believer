import type { TaskClass } from './task.class.js';

export interface DiaryWritterLike {
    exists(): Promise<boolean>;
    loadFile(classes: TaskClass[]): Promise<Map<string, TaskClass[]>>;
    writeFile(classes: TaskClass[]): Promise<void>;
}