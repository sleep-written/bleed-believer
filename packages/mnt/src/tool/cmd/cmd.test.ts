import test from 'ava';
import { cmd } from './cmd.js';

test('exec "echo hello world"', async t => {
    const resp = await cmd('echo', ['hello', 'world']);
    const text = resp.stdout?.toString('utf-8');
    t.is(text, 'hello world\n');
});

test('exec "neofetch"', async t => {
    const resp = await cmd('neofetch');
    const text = resp.stdout?.toString('utf-8') as string;
    t.truthy(text);
    t.regex(text, /os/gi);
    t.regex(text, /kernel/gi);
    t.regex(text, /uptime/gi);
    t.regex(text, /packages/gi);
    t.regex(text, /shell/gi);
    t.regex(text, /terminal/gi);
    t.regex(text, /cpu/gi);
    t.regex(text, /gpu/gi);
    t.regex(text, /memory/gi);
});

test('exec "lol" (doesn\'t exists)', t => {
    return t.throwsAsync(
        cmd('lol'),
        { message: 'spawn lol ENOENT' }
    );
});
