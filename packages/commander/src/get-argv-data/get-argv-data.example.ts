
import { getArgvData, GET_ARGV_DATA } from './get-argv-data.js';
import { Command, Executable } from '../command/index.js';
import { Commander } from '../commander.js';
import { ArgvData } from '../argv-parser/index.js';
import { CommandRouting } from '../command-routing/command-routing.js';

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
    argvData!: ArgvData;

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
    argvData!: ArgvData;

    start(): void {
        tail.set(this.argvData.items);
    }
}

@CommandRouting({
    commands: [Cmd01, Cmd02]
})
export class AppRouting {}