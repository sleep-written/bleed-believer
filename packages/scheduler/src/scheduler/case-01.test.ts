import test from 'ava';

import { TaskExample, DiaryFake } from './case-01.example.js';
import { Scheduler } from './scheduler.js';

test.beforeEach(_ => TaskExample.reset());

test.serial('Execute tasks', async t => {
    t.timeout(3800);

    const scheduler = new Scheduler(
        [ TaskExample ],
        new DiaryFake
    );
    
    await scheduler.run();
    t.is(TaskExample.count, 3);
});

test.serial('Execute tasks (with callbacks)', async t => {
    t.timeout(3800);

    const historyBefore:    (number | undefined)[] = [];
    const historyAfter:     (number | undefined)[] = [];
    const scheduler = new Scheduler(
        [ TaskExample ],
        new DiaryFake
    );

    scheduler.onBeforeEach  (_ => historyBefore.push(TaskExample.count));
    scheduler.onAfterEach   (_ => historyAfter. push(TaskExample.count));
    
    await scheduler.run();
    t.deepEqual(historyBefore,  [0, 1, 2]);
    t.deepEqual(historyAfter,   [1, 2, 3]);
});

test.serial('Execute tasks now', async t => {
    const scheduler = new Scheduler(
        [ TaskExample ],
        new DiaryFake
    );
    
    await scheduler.runNow();
    t.is(TaskExample.count, 1);
});

test.serial('Execute tasks now (with callbacks)', async t => {
    let historyBefore:    number | undefined;
    let historyAfter:     number | undefined;
    const scheduler = new Scheduler(
        [ TaskExample ],
        new DiaryFake
    );

    scheduler.onBeforeEach  (_ => historyBefore  = TaskExample.count);
    scheduler.onAfterEach   (_ => historyAfter   = TaskExample.count);
    
    await scheduler.runNow();
    t.deepEqual(historyBefore,  0);
    t.deepEqual(historyAfter,   1);
    t.deepEqual(TaskExample.count,   1);
});