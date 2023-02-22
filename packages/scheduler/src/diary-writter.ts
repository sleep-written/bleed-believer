import type { Diary, TaskClass, DiaryWritterLike } from './interfaces/index.js';

import { access, readFile, writeFile } from 'fs/promises';
import { resolve, relative } from 'path';
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

    async exists(): Promise<boolean> {
        try {
            await access(this.#path);
            return true;
        } catch {
            return false;
        }
    }

    writeFile(classes: TaskClass[]): Promise<void> {
        let text = '';
        for (const taskClass of classes) {
            if (text.length === 0) {
                text += `# How to configure the execution of a task:\n`;
                text += `# The exact name of the task class\n`;
                text += `${taskClass.name}:\n`;
                text += '  # From monday (1) to friday (5)\n';
                text += '- days: [1, 2, 3, 4, 5]\n\n';
                text += '  # At 00:00:00 and 12:00:00 (24 hrs format)\n';
                text += '  timestamps:\n';
                text += '  - [ 0,  0,  0]\n';
                text += '  - [12,  0,  0]\n\n';
                text += '  # At saturday (6) and sunday (0)\n';
                text += '- days: [6, 0]\n';
                text += '  # This will be triggered every 30 mins, ignoring the "timestamps" field\n';
                text += '  interval: [ 0, 30,  0]\n\n';

            } else {
                text += '\n\n';
                text += `${taskClass.name}:\n`;
                text += '- days: [1, 2, 3, 4, 5]\n';
                text += '  timestamps:\n';
                text += '  - [ 0,  0,  0]';
            }
        }

        return writeFile(this.#path, text, 'utf-8');
    }

    async loadFile(classes: TaskClass[]): Promise<Map<string, TaskClass[]>> {
        // Check id the file exists
        const filePath = './' + relative('.', this.#path);
        try {
            await access(this.#path);
        } catch {
            throw new Error(`The file "${filePath}" doesn't exists`);
        }

        // Reads the file
        const text = await readFile(this.#path, 'utf-8');

        try {
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
                            // Gets or generate timestamps
                            const clocks = group.interval instanceof Array
                                ?   DateRef.getIntervals(dd, ...group.interval)
                                :   group.timestamps?.map(([hh, mm, ss]) => {
                                        if (typeof hh === 'string') {
                                            hh = parseInt(hh, 10);
                                        }

                                        if (typeof mm === 'string') {
                                            mm = parseInt(mm, 10);
                                        }

                                        if (typeof ss === 'string') {
                                            ss = parseInt(ss, 10);
                                        }

                                        return new DateRef(dd, hh, mm, ss);
                                    });
                
                            // Iterate through timestamps
                            clocks?.forEach(date => {
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
        } catch {
            throw new Error(`The file "${filePath}" is unreadable, try to create the file again`);
        }
    }
}