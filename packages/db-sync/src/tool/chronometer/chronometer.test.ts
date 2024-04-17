import test from 'ava';
import { setTimeout } from 'timers/promises';
import { Chronometer } from './chronometer.js';

test('Count 3 seconds', async t => {
    t.timeout(3500);
    const temp = new Chronometer();
    temp.start();

    await setTimeout(3000);
    const resp = temp.stop();

    t.is(Math.trunc(resp), 3);
});

test('Count for every second, for 3 seconds', async t => {
    t.timeout(3500);
    const temp = new Chronometer();
    temp.start();

    await setTimeout(1000);
    t.is(temp.lap(0), 1);

    await setTimeout(1000);
    t.is(temp.lap(0), 2);

    await setTimeout(1000);
    t.is(temp.stop(0), 3);
});
