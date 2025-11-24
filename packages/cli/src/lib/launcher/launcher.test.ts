import type { LauncherInject, ChildProcessObject } from './interfaces/index.js';

import { setTimeout } from 'timers/promises';
import { Launcher } from './launcher.js';
import test from 'ava';

type EventType = 'exit' | 'close' | 'error';

interface Event {
    ms: number;
    exit?: boolean;
    output: 'stdout' | 'stderr';
    message: string;
}

class ChildProcess implements ChildProcessObject {
    executable: string;
    options: { stdio: 'inherit' };
    args: string[];

    exit:  Function[] = [];
    close: Function[] = [];
    error: Function[] = [];

    stdout: string[] = [];
    stderr: string[] = [];

    constructor(executable: string, args: string[], options: { stdio: 'inherit' }) {
        this.executable = executable;
        this.options = options;
        this.args = args;
    }

    once(e: 'exit',  c: () => void): ChildProcessObject;
    once(e: 'close', c: () => void): ChildProcessObject;
    once(e: 'error', c: (err: Error) => void): ChildProcessObject;
    once(e: EventType,  c: Function): ChildProcessObject {
        if (this[e] instanceof Array) {
            this[e].push(c);
        } else {
            this[e] = [ c ];
        }

        return this;
    }
}

class LauncherInjectObject implements LauncherInject {
    #events: Event[] = [];
    process = {
        argv: [
            '/path/to/node/executable',
            '/path/to/project/node_modules/@bleed-believer/cli/dist/cli.js'
        ]
    };

    #child?: ChildProcess;
    get child(): ChildProcess | undefined {
        return this.#child;
    }

    constructor(events: Event[]) {
        this.#events = events;
    }

    spawn(exe: string, args: string[], options: { stdio: 'inherit' }): ChildProcessObject {
        this.#child = new ChildProcess(exe, args, options);
        setImmediate(async () => {
            while (this.#events.length > 0) {
                const event = this.#events.shift();
                if (event) {
                    await setTimeout(event.ms);
                    this.#child![event.output].push(event.message);
                    if (event.exit) {
                        this.#child!['exit'].map(x => x());
                        break;
                    }
                }
            }

            this.#events = [];
        });

        return this.#child;
    }
}

test('Start node process', async t => {
    const inject = new LauncherInjectObject(
        [
            { output: 'stdout', message: 'jajaja', ms: 500 },
            { output: 'stdout', message: 'gegege', ms: 500 },
            { output: 'stdout', message: 'ñeeeee', ms: 500, exit: true },
        ]
    );

    const launcher = new Launcher('/path/to/project/src/index.ts',[ 'hello', 'world' ], inject);
    await launcher.execute();

    t.deepEqual(inject.child?.options, { stdio: 'inherit' });
    t.deepEqual(inject.child?.stderr, []);
    t.deepEqual(inject.child?.stdout, [ 'jajaja', 'gegege', 'ñeeeee' ]);
    t.deepEqual(inject.child?.executable, '/path/to/node/executable');
    t.deepEqual(inject.child?.args, [
        '--import',
        '@bleed-believer/cli',
        '/path/to/project/src/index.ts',
        'hello',
        'world'
    ]);
});

test('Watch node process', async t => {
    const inject = new LauncherInjectObject(
        [
            { output: 'stdout', message: 'jajaja', ms: 500 },
            { output: 'stdout', message: 'gegege', ms: 500 },
            { output: 'stdout', message: 'ñeeeee', ms: 500, exit: true },
        ]
    )

    const launcher = new Launcher('/path/to/project/src/index.ts', [ 'hello', 'world' ], inject);
    await launcher.execute(true);

    t.deepEqual(inject.child?.options,      { stdio: 'inherit' });
    t.deepEqual(inject.child?.stdout,       [ 'jajaja', 'gegege', 'ñeeeee' ]);
    t.deepEqual(inject.child?.stderr,       []);
    t.deepEqual(inject.child?.executable,   '/path/to/node/executable');
    t.deepEqual(inject.child?.args, [
        '--watch',
        '--import',
        '@bleed-believer/cli',
        '/path/to/project/src/index.ts',
        'hello',
        'world'
    ]);
});