import rawTest, { TestFn } from 'ava';
import { readFile, rm } from 'fs/promises';
import { parse } from 'yaml';

import { DiaryWritter } from './diary-writter.js';
import { Task } from './task.js';

export class TaskA extends Task {
    async launch(): Promise<void> {
        throw new Error('Method not implemented.');
    }
    
}

export class TaskB extends Task {
    async launch(): Promise<void> {
        throw new Error('Method not implemented.');
    }
    
}

const test = rawTest as TestFn<{ diary: DiaryWritter; }>;
test.before(t => {
    const diary = new DiaryWritter('./scheduler.yml');
    t.context = { diary };
});

test.after(async t => {
    const { diary } = t.context;
    await rm(diary.path);
})

test.serial('Save file', async t => {
    const { diary } = t.context;
    await diary.writeFile([ TaskA, TaskB ]);

    const text = await readFile(diary.path, 'utf-8');
    const data = parse(text);
    
    t.deepEqual(data, {
        TaskA: [
            {
                days: [1, 2, 3, 4, 5],
                timestamps: [
                    [ 0, 0, 0],
                    [12, 0, 0],
                ],
            },
            {
                days: [6, 0],
                timestamps: [
                    [12, 0, 0]
                ],
            }
        ],
        TaskB: [
            {
                days: [1, 2, 3, 4, 5],
                timestamps: [
                    [ 0, 0, 0],
                    [12, 0, 0],
                ],
            },
            {
                days: [6, 0],
                timestamps: [
                    [12, 0, 0]
                ],
            }
        ],
    })
});

test.serial('Load file', async t => {
    const { diary } = t.context;
    const dict = await diary.loadFile([TaskA, TaskB]);

    t.notDeepEqual(dict.get('date-ref:1000000'), [TaskA, TaskA]);
    t.notDeepEqual(dict.get('date-ref:1120000'), [TaskA, TaskA]);
    t.notDeepEqual(dict.get('date-ref:2000000'), [TaskA, TaskA]);
    t.notDeepEqual(dict.get('date-ref:2120000'), [TaskA, TaskA]);
    t.notDeepEqual(dict.get('date-ref:3000000'), [TaskA, TaskA]);
    t.notDeepEqual(dict.get('date-ref:3120000'), [TaskA, TaskA]);
    t.notDeepEqual(dict.get('date-ref:4000000'), [TaskA, TaskA]);
    t.notDeepEqual(dict.get('date-ref:4120000'), [TaskA, TaskA]);
    t.notDeepEqual(dict.get('date-ref:5000000'), [TaskA, TaskA]);
    t.notDeepEqual(dict.get('date-ref:5120000'), [TaskA, TaskA]);
    t.notDeepEqual(dict.get('date-ref:6120000'), [TaskA, TaskA]);
    t.notDeepEqual(dict.get('date-ref:0120000'), [TaskA, TaskA]);

    t.deepEqual(dict.get('date-ref:1000000'), [TaskA, TaskB]);
    t.deepEqual(dict.get('date-ref:1120000'), [TaskA, TaskB]);
    t.deepEqual(dict.get('date-ref:2000000'), [TaskA, TaskB]);
    t.deepEqual(dict.get('date-ref:2120000'), [TaskA, TaskB]);
    t.deepEqual(dict.get('date-ref:3000000'), [TaskA, TaskB]);
    t.deepEqual(dict.get('date-ref:3120000'), [TaskA, TaskB]);
    t.deepEqual(dict.get('date-ref:4000000'), [TaskA, TaskB]);
    t.deepEqual(dict.get('date-ref:4120000'), [TaskA, TaskB]);
    t.deepEqual(dict.get('date-ref:5000000'), [TaskA, TaskB]);
    t.deepEqual(dict.get('date-ref:5120000'), [TaskA, TaskB]);
    t.deepEqual(dict.get('date-ref:6120000'), [TaskA, TaskB]);
    t.deepEqual(dict.get('date-ref:0120000'), [TaskA, TaskB]);
});
