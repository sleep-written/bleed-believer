import rawTest, { TestFn } from 'ava';
import { readFile, rm, writeFile } from 'fs/promises';
import { parse, stringify } from 'yaml';

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
                interval: [0, 30, 0]
            }
        ],
        TaskB: [
            {
                days: [1, 2, 3, 4, 5],
                timestamps: [
                    [ 0, 0, 0],
                ],
            }
        ],
    })
});

test.serial('Load file', async t => {
    const { diary } = t.context;
    const dict = await diary.loadFile([TaskA, TaskB]);

    t.deepEqual(dict.get('date-ref:1000000'), [TaskA, TaskB]);
    t.deepEqual(dict.get('date-ref:1120000'), [TaskA]);
    t.deepEqual(dict.get('date-ref:2000000'), [TaskA, TaskB]);
    t.deepEqual(dict.get('date-ref:2120000'), [TaskA]);
    t.deepEqual(dict.get('date-ref:3000000'), [TaskA, TaskB]);
    t.deepEqual(dict.get('date-ref:3120000'), [TaskA]);
    t.deepEqual(dict.get('date-ref:4000000'), [TaskA, TaskB]);
    t.deepEqual(dict.get('date-ref:4120000'), [TaskA]);
    t.deepEqual(dict.get('date-ref:5000000'), [TaskA, TaskB]);
    t.deepEqual(dict.get('date-ref:5120000'), [TaskA]);
    t.deepEqual(dict.get('date-ref:6120000'), [TaskA]);
    t.deepEqual(dict.get('date-ref:0120000'), [TaskA]);
});

test.serial('Generale and load a file with interval', async t => {
    // Write a fake file with the interval to test
    await rm(t.context.diary.path);
    await writeFile(t.context.diary.path, stringify({
        TaskA: [{
            days: [1],
            timestamps: [
                [0, 0, 0]
            ]
        }],
        TaskB: [{
            days: [2],
            interval: [0, 30]
        }]
    }), 'utf-8');

    // Load the file
    const map = await t.context.diary.loadFile([TaskA, TaskB]);
    t.is(map.size, 49);
    
    // Get the first keys
    const keys = Array
        .from(map.keys())
        .slice(0, 5);

    // Comapre keys
    t.deepEqual(keys, [
        'date-ref:1000000',
        'date-ref:2000000',
        'date-ref:2003000',
        'date-ref:2010000',
        'date-ref:2013000',
    ]);
});