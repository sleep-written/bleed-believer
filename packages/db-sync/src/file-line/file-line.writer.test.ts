import test from 'ava';
import { tmpdir } from 'os';
import { readFile } from 'fs/promises';

import { FileLineWriter } from './file-line.writer.js';

const writer = new FileLineWriter(tmpdir(), './test.file-line.writter.txt');
test.beforeEach(async _ => writer.kill(true));
test.afterEach(async _ => writer.kill());

test.serial('Write a small file', async t => {
    await writer.append(async append => {
        // Writer is writing
        t.true(writer.isWriting);
        
        await append('hello');
        await append('world!');
        
        // Writer is writing
        t.true(writer.isWriting);
    });

    // Writer isn't writing
    t.false(writer.isWriting);
    
    // Check if content is ok
    const text = await readFile(writer.path, 'utf-8');
    t.is(text, 'hello\nworld!');
});

test.serial('Write and emits an error', async t => {
    await t.throwsAsync(
        async () => {
            await writer.append(async append => {
                // Writer is writing
                t.true(writer.isWriting);
                
                await append('foo');
                await append('bar');
                
                // Writer is writing
                t.true(writer.isWriting);
                throw new Error('lol');
            });
        },
        { message: 'lol' }
    );

    // Writer isn't writing
    t.false(writer.isWriting);
    
    // Check if content is ok
    const text = await readFile(writer.path, 'utf-8');
    t.is(text, 'foo\nbar');
});