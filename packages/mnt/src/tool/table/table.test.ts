import test from 'ava';
import { readFile } from 'fs/promises';

import { realign } from '../realign/realign.js';
import { table } from './table.js';

test('table-01.txt', async t => {
    const text = await readFile('./test/table-01.txt', 'utf-8');
    const real = await realign(text);
    const resp = table(real);

    t.deepEqual(resp, [
        { hello: '333', world: 'pass' },
        { hello: '3', world: 'fail' },
        { hello: '3.3', world: 'fail' }
      ]);
});

test('table-02.txt', async t => {
    const text = await readFile('./test/table-02.txt', 'utf-8');
    const real = await realign(text);
    const resp = table(real);

    t.deepEqual(resp, [
        {
            FSTYPE: 'ext4',
            SOURCE: '/dev/sdb',
            TARGET: '/',
            SIZE: '251G'
        },
        {
            FSTYPE: 'tmpfs',
            SOURCE: 'tmpfs',
            TARGET: '/mnt/wsl',
            SIZE: '6.2G'
        },
        {
            FSTYPE: '9p',
            SOURCE: 'tools[/init]',
            TARGET: '/init',
            SIZE: '476.'
        },
        {
            FSTYPE: 'devtmpfs',
            SOURCE: 'none',
            TARGET: '/dev',
            SIZE: '6.2G'
        }
      ]);
});
