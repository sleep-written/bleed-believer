import { join, resolve } from 'path';
import { mkdir, rm } from 'fs/promises';
import test from 'ava';

import { type TaskLaunchOptions } from '../task-launcher/index.js';
import { TaskConfig } from './task-config.js';

const filePath = resolve('./scheduler-conf/file-01.yml');

test.before(async _ => {
    await mkdir(join(filePath, '..'), { recursive: true });
});

test.after(async _ => {
    await rm(join(filePath, '..'), { recursive: true });
});

test.serial('Generate configuration file', async t => {
    await new TaskConfig(filePath).generate([ 'FakeTask01', 'FakeTask02' ]);
    t.pass();
});

test.serial('Watch changes', async t => {
    const taskConfig = new TaskConfig(filePath);
    const values: TaskLaunchOptions[] = [];

    taskConfig.watch({
        emitAfterLink: true,
        callback: async (content) => {
            values.push(content);
        },
        onFail: (err) => {
            t.fail(err.message);
        },
    });

    await new Promise(r => setTimeout(r, 1000));
    await taskConfig.save({
        hello: 'infinite',
        world: 'infinite'
    });
    
    await new Promise(r => setTimeout(r, 1000));
    await taskConfig.save({
        foo: [
            {
                days: [ 1, 2, 3, 4, 5 ],
                timestamps: [ [ 0, 0, 0 ] ]
            },
            {
                days: [ 6, 0 ],
                timestamps: [
                    [  0, 0, 0 ],
                    [ 12, 0, 0 ]
                ]
            }
        ],
        bar: 'infinite'
    });
    
    await new Promise(r => setTimeout(r, 1000));
    taskConfig.unwatch();
    t.deepEqual(values, [
        // Archivo generado
        {
            FakeTask01: [
                {
                    days: [1, 2, 3, 4, 5],
                    timestamps: [
                        [0, 0, 0]
                    ]
                }
            ],
            FakeTask02: [
                {
                    days: [1, 2, 3, 4, 5],
                    timestamps: [
                        [0, 0, 0]
                    ]
                }
            ]
        },

        // 1ra modificación
        {
            hello: 'infinite',
            world: 'infinite'
        },

        // 2da modificación
        {
            foo: [
                {
                    days: [ 1, 2, 3, 4, 5 ],
                    timestamps: [ [ 0, 0, 0 ] ]
                },
                {
                    days: [ 6, 0 ],
                    timestamps: [
                        [  0, 0, 0 ],
                        [ 12, 0, 0 ]
                    ]
                }
            ],
            bar: 'infinite'
        }
    ]);
});
