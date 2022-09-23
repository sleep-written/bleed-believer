import type { Executable } from '../command/index.js';
import type { ArgvData } from '../argv-parser/index.js';

import { CommandRouting } from '../command-routing/index.js';
import { getArgvData } from '../get-argv-data/index.js';
import { Command } from '../command/index.js';

export const mem = new class {
    private _value: string[] = [];

    get(): string[] {
        return this._value;
    }

    set(v: string[]) {
        this._value = v;
    }
}

@Command({
    name: 'Command 01',
    path: 'mv :file1 :file2'
})
export class Com01 implements Executable {
    @getArgvData()
    declare argvData: ArgvData;

    start(): void {
        const { file1, file2 } = this.argvData.param;
        mem.set([file1, file2]);
    }
}

@Command({
    name: 'Command 02',
    path: 'call ...'
})
export class Com02 implements Executable {
    @getArgvData()
    declare argvData: ArgvData;

    start(): void {
        const { items } = this.argvData;
        mem.set(items);
    }
}

@CommandRouting({
    path: 'app',
    commands: [Com01, Com02]
})
export class AppRouting {}
