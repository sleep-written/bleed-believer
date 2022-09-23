import type { Executable } from '../command/index.js';
import type { ArgvData } from '../argv-parser/index.js';

import { CommandRouting } from '../command-routing/command-routing.js';
import { getArgvData } from './get-argv-data.js';
import { Command } from '../command/index.js';

export const tail = new class {
    private _value!: any;
    get(): any {
        return this._value;
    }
    set(v: any): void {
        this._value = v;
    }
};

@Command({
    name: 'Command 01',
    path: 'cmd01 :file01 :file02'
})
export class Cmd01 implements Executable {
    @getArgvData()
    declare argvData: ArgvData;

    start(): void {
        tail.set(this.argvData.param);
    }
}

@Command({
    name: 'Command 02',
    path: 'cmd02 ...'
})
export class Cmd02 implements Executable {
    @getArgvData()
    declare argvData: ArgvData;

    start(): void {
        tail.set(this.argvData.items);
    }
}

@CommandRouting({
    commands: [Cmd01, Cmd02]
})
export class AppRouting {}