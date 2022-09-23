import type { Executable } from '../command/index.js';

import { CommandRouting } from '../command-routing/index.js';
import { Command } from '../command/index.js';

@Command({
    name: 'command 01',
    path: 'com01'
})
export class Com01 implements Executable {
    start(): void {}
}

@Command({
    name: 'command 02',
    path: 'com02'
})
export class Com02 implements Executable {
    start(): void {}
}

@CommandRouting({
    path: 'joder chaval',
    commands: [ Com01, Com02 ]
})
export class Routing01 {}
