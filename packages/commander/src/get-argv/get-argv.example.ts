import type { Executable } from '../command/index.js';
import type { Argv } from '../argv-parser/index.js';

import { CommandRouting } from '../command-routing/index.js';
import { Command } from '../command/index.js';
import { GetArgv } from './get-argv.js';

export const tail = new class {
    private _value!: any;
    get(): any {
        return this._value;
    }
    set(v: any): void {
        this._value = v;
    }
}

@Command({
    path: 'hello world',
    name: 'Command 01'
})
export class Cmd01 implements Executable {
    @GetArgv()
    declare argv: Argv;

    start(): void {
        tail.set(this.argv.main);
    }
}

@Command({
    path: 'cmd02',
    name: 'Command 02'
})
export class Cmd02 implements Executable {
    @GetArgv()
    declare argv: Argv;

    start(): void {
        tail.set(this.argv.flags);
    }
}

@Command({
    path: 'cmd03 :file01 :file02',
    name: 'Command 03'
})
export class Cmd03 implements Executable {
    @GetArgv()
    declare argv: Argv;

    start(): void {
        tail.set(this.argv.main);
    }
}

@CommandRouting({
    commands: [
        Cmd01,
        Cmd02,
        Cmd03,
    ]
})
export class AppRouting {}
