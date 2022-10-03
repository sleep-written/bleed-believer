import test from 'ava';
import { Resource } from './resource.js';

const path = '/mnt/z';

test.serial('get all Resources', async t => {
    const Resources = await Resource.get();
    const item = Resources.find(x => (
        x.fstype === 'ext4' &&
        x.target === '/'
    ));
    
    t.truthy(item);
});

test.serial('get the target path', async t => {
    const item = await Resource.find(x => (
        x.target === path
    ));
    
    t.truthy(item);
});

test.serial('unmount the target path', async t => {
    const item = await Resource.find(x => (
        x.target === path
    ));
    
    t.truthy(item);
    await item?.umount(true);
});

test.serial('mount the target path', async t => {
    const item = await Resource.mount(path, true);
    t.truthy(item);
});
