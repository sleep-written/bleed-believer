import test from 'ava';
import { readFile } from 'fs/promises';
import { realign } from './realign.js';

test('table-01.txt', async t => {
    const text = await readFile('./test/table-01.txt', 'utf-8');
    const resp = await realign(text);

    t.is(resp,
`hello  world
333    pass
3      fail
3.3    fail
`
    );
});

test('table-02.txt', async t => {
    const text = await readFile('./test/table-02.txt', 'utf-8');
    const resp = await realign(text);

    t.is(resp,
`FSTYPE    SOURCE        TARGET    SIZE
ext4      /dev/sdb      /         251G
tmpfs     tmpfs         /mnt/wsl  6.2G
9p        tools[/init]  /init     476.3G
devtmpfs  none          /dev      6.2G
`
    );
});
