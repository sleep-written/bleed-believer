import { CommandRoute, CommandRouting } from '../command-routing/index.js';
import { Command, Executable } from '../command/index.js';

export const execTail: (string | number)[] = [];

@Command({
    name: 'Command 01',
    path: 'com01'
})
export class Com01 implements Executable {
    start(): void {
        execTail.push('com01');
        throw new Error();
    }
}

@Command({
    name: 'Command 02',
    path: 'com02'
})
export class Com02 implements Executable {
    start(): void {
        execTail.push('com02');
        throw new Error();
    }
}

@Command({
    name: 'Command 03',
    path: 'com03'
})
export class Com03 implements Executable {
    start(): void {
        execTail.push('com03');
        throw new Error();
    }
}

@Command({
    name: 'Command 04',
    path: 'com04'
})
export class Com04 implements Executable {
    start(): void {
        execTail.push('com04');
        throw new Error();
    }
}

@CommandRouting({
    path: 'api',
    commands: [Com01, Com02]
})
export class ApiRouting implements CommandRoute {
    before(): void {
        execTail.push('ApiRouting:before');
    }

    after(): void {
        execTail.push('ApiRouting:after');
    }

    failed(): void {
        execTail.push('ApiRouting:failed');
    }
}

@CommandRouting({
    path: 'app',
    routings: [ApiRouting],
    commands: [Com03, Com04]
})
export class AppRouting implements CommandRoute {
    before(): void {
        execTail.push('AppRouting:before');
    }

    after(): void {
        execTail.push('AppRouting:after');
    }

    failed(): void {
        execTail.push('AppRouting:failed');
    }
}