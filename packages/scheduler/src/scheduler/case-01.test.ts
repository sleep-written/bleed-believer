import rawTest, { TestFn } from 'ava';

import { TaskExample, DiaryFake } from './case-01.example.js';
import { Scheduler } from './scheduler.js';

const test = rawTest as TestFn<{ scheduler: Scheduler }>;
test.before(t => {
    const scheduler = new Scheduler(
        [ TaskExample ],
        new DiaryFake()
    );

    t.context = { scheduler };
});

test('Execute', async t => {
    t.timeout(8000);
    const { scheduler } = t.context;
    await scheduler.run();

    t.is(TaskExample.count, 3);
});
