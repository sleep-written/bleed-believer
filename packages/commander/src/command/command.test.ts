import test from 'ava';

import { Command, COMMAND } from './command.js';
import { Executable } from './interfaces/index.js';

test('Command 01', t => {
    @Command({
        name: 'Command 01',
        path: 'cmd 01'
    })
    class Command01 implements Executable {
        start(): Promise<void> {
            return Promise.resolve();
        }
    }

    const meta = COMMAND.get(Command01);
    t.is(meta.name, 'Command 01');
});
