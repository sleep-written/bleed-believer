import type { CommandRoute } from '../command-routing/index.js';
import type { Executable } from '../command/index.js';

import { CommandRouting } from '../command-routing/index.js';
import { Command } from '../command/index.js';

export const mem = new class {
    private _value: string[] = [];

    get(): string[] {
        return this._value;
    }

    add(v: string): void {
        this._value.push(v);
    }

    reset(): void {
        this._value = [];
    }
};

@Command({
    name: 'Command 01',
    path: 'com01'
})
export class Com01 implements Executable {
    start(): void {
        mem.add('com01');
        throw new Error();
    }
}

@Command({
    name: 'Command 02',
    path: 'com02'
})
export class Com02 implements Executable {
    start(): void {
        mem.add('com02');
        throw new Error();
    }
}

@Command({
    name: 'Command 03',
    path: 'com03'
})
export class Com03 implements Executable {
    start(): void {
        mem.add('com03');
        throw new Error();
    }
}

@Command({
    name: 'Command 04',
    path: 'com04'
})
export class Com04 implements Executable {
    start(): void {
        mem.add('com04');
        throw new Error();
    }
}

@CommandRouting({
    path: 'api',
    commands: [Com01, Com02]
})
export class ApiRouting implements CommandRoute {
    before(): void {
        mem.add('ApiRouting:before');
    }

    after(): void {
        mem.add('ApiRouting:after');
    }

    failed(): void {
        mem.add('ApiRouting:failed');
    }
}

@CommandRouting({
    path: 'app',
    routings: [ApiRouting],
    commands: [Com03, Com04]
})
export class AppRouting implements CommandRoute {
    before(): void {
        mem.add('AppRouting:before');
    }

    after(): void {
        mem.add('AppRouting:after');
    }

    failed(): void {
        mem.add('AppRouting:failed');
    }
}