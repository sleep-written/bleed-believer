import { CommandRouting } from '@bleed-believer/commander';

import { BuildCommand } from './build.command';
import { KillCommand } from './kill.command';

@CommandRouting({
    main: 'nested',
    commands: [
        BuildCommand,
        KillCommand,
    ]
})
export class NestedRouting { }