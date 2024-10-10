import { CommandRouting } from '@bleed-believer/commander';

import { StartCommand } from './start.command.js';
import { BuildCommand } from './build.command.js';
import { HelpCommand } from './help.command.js';

@CommandRouting({
    commands: [
        StartCommand,
        BuildCommand,
        HelpCommand
    ]
})
export class CLIRouting {}