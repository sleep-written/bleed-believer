import anyTest, { TestFn } from 'ava';
import { MetaManager } from './meta-manager.js';

interface Struct {
    text: string;
    value: number;
}
const test = anyTest as TestFn<{ meta: MetaManager<Struct>; }>;
class Target {}

test.before(t => {
    t.context = {
        meta: new MetaManager<Struct>('jajaja')
    }
});

test.serial('Create metadata', t => {
    t.context.meta.set(Target, {
        text: 'foobar',
        value: 666
    });

    t.pass();
});

test.serial('Read Metadata', t => {
    const data = t.context.meta.get(Target);
    t.deepEqual(data, {
        text: 'foobar',
        value: 666
    });
});
