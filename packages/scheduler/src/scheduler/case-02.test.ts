import rawTest, { TestFn } from 'ava';

import { DiaryFake, Task01, Task02, Task03, queue } from './case-02.example.js';
import { Scheduler } from './scheduler.js';

const test = rawTest as TestFn<{ scheduler: Scheduler; }>;
test.before(t => {
    const scheduler = new Scheduler(
        [ Task01, Task02, Task03 ],
        new DiaryFake()
    )

    t.context = { scheduler };
});

test('Execute tasks', async t => {
    t.timeout(5800);

    const { scheduler } = t.context;
    await scheduler.run();

    t.deepEqual(queue, [1, 2, 3, 2, 1]);
});