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

//---------------------------------------------
@Command({
    name: 'command 03',
    path: 'com03'
})
export class Com03 implements Executable {
    start(): void {}
}

@Command({
    name: 'command 04',
    path: 'com04'
})
export class Com04 implements Executable {
    start(): void {}
}

@CommandRouting({
    routings: [ Routing01 ],
    commands: [ Com03, Com04 ]
})
export class Routing02 {}