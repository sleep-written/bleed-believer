import { Command, Executable } from '../command/index.js';
import { CommandRouting } from '../command-routing/index.js';
import { Commander } from '../commander.js';

@Command({
    name: 'Command 01',
    path: 'mv :file1 :file2'
})
export class Com01 implements Executable {
    start(): void {
        const { file1, file2 } = app.argvData.param;
        mem.set([file1, file2]);
    }
}

@Command({
    name: 'Command 02',
    path: 'call ...'
})
export class Com02 implements Executable {
    start(): void {
        const { items } = app.argvData;
        mem.set(items);
    }
}

@CommandRouting({
    path: 'app',
    commands: [Com01, Com02]
})
export class AppRouting {}

/**
 * The "Commander" instance's root application
 */
export const app = new Commander(AppRouting);
export const mem = new class {
    private _value: string[] = [];

    get(): string[] {
        return this._value;
    }

    set(v: string[]) {
        this._value = v;
    }
}
