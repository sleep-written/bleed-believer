import type { Diary, TaskClass, DiaryWritterLike } from './interfaces/index.js';

import { readFile, writeFile } from 'fs/promises';
import { resolve } from 'path';
import { parse } from 'yaml';

import { DateRef } from './date-ref.js';

export class DiaryWritter implements DiaryWritterLike {
    #path: string;
    get path(): string {
        return this.#path;
    }

    constructor(path: string) {
        this.#path = resolve(path);
    }

    writeFile(classes: TaskClass[]): Promise<void> {
        let text = '';
        for (const taskClass of classes) {
            if (text.length > 0) {
                text += '\n\n';
            }

            text += `# The name of the task:\n`;
            text += `${taskClass.name}:\n`;
            text += '    # The days where the current diary will be launched.\n';
            text += '    # sunday = 0 ... to saturday = 6\n';
            text += '-   days: [1, 2, 3, 4, 5]\n\n';
            text += '    # The hours where the task will be executed in the selected days\n';
            text += '    # format = [hh, mm, ss]; hh = hours; mm = minutes; ss = seconds\n';
            text += '    timestamps:\n';
            text += '    -   [ 0,  0,  0]\n';
            text += '    -   [12,  0,  0]\n\n';
            text += '-   days: [6, 0]\n';
            text += '    timestamps:\n';
            text += '    -   [12,  0,  0]';
        }

        return writeFile(this.#path, text, 'utf-8');
    }

    async loadFile(classes: TaskClass[]): Promise<Map<string, TaskClass[]>> {
        // Reads the file
        const text = await readFile(this.#path, 'utf-8');
        const data = parse(text) as Diary;

        const map = new Map<string, TaskClass[]>();
        for (const [ name, diaryItem ] of Object.entries(data)) {
            // Searches the class according the name
            const target = classes.find(x => x.name === name);
            if (target) {
                // Iterate through the diary
                diaryItem.forEach(group => {
                    // Iterate through days
                    group.days.forEach(dd => {
                        // Iterate through timestamps
                        group.timestamps.forEach(([ hh, mm, ss ]) => {
                            // Creates a new key using the DateRef class
                            const date = new DateRef(dd, hh, mm, ss);

                            const targets = map.get(date.toString());
                            if (!targets) {
                                // Create a new registry
                                map.set(date.toString(), [ target ]);
                            } else {
                                // Adds the target only if doesn't exists inside of
                                const found = targets.some(x => x.name === target.name);
                                if (!found) {
                                    targets.push(target);
                                }
                            }
                        });
                    });
                });
            }
        }

        // Returns the dictionary
        return map;
    }
}