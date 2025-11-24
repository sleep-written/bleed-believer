import type { SleepyheadInject } from './interfaces/index.js';

import { Sleepyhead } from './sleepyhead.js';
import test from 'ava';

class Inject implements SleepyheadInject {
    #timestamp = 0;

    date = {
        now: () => this.#timestamp
    };

    async setTimeout(ms: number): Promise<void> {
        this.#timestamp += ms;
    }
}

test('ms = 1000; elapsed = 250; remaining = 750', async t => {
    const inject = new Inject();
    const sleepyhead = new Sleepyhead(1_000, inject);

    await inject.setTimeout(250);
    await sleepyhead.sleep();

    t.is(inject.date.now(), 1_000);
});