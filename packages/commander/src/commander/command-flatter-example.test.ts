import { Command } from '../command';
import { Executable } from '../interfaces';
import { CommandRouting } from '../command-routing';

@Command({
    main: 'cmd01',
    name: 'Command 01'
})
export class Command01 implements Executable {
    start(): void { throw new Error('Command01'); }
}

@Command({
    main: 'cmd02',
    name: 'Command 02'
})
export class Command02 implements Executable {
    start(): void { throw new Error('Command02'); }
}

@Command({
    main: 'cmd03',
    name: 'Command 03'
})
export class Command03 implements Executable {
    start(): void { throw new Error('Command03'); }
}

@Command({
    main: 'cmd04',
    name: 'Command 04'
})
export class Command04 implements Executable {
    start(): void { throw new Error('Command04'); }
}

@CommandRouting({
    main: 'nested',
    commands: [
        Command03,
        Command04,
    ]
})
export class Nested01Routing {}

@CommandRouting({
    routes: [
        Nested01Routing
    ],
    commands: [
        Command01,
        Command02,
    ]
})
export class AppRouting {}
