import { CommandRouting } from '@bleed-believer/commander';

import { StartCommand } from './start.command.js';
import { BuildCommand } from './build.command.js';

@CommandRouting({
    commands: [
        StartCommand,
        BuildCommand
    ]
})
export class CLIRouting {}