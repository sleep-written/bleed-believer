import { CommandRouting } from '@bleed-believer/commander';

import { HelloWorldCommand } from './hello-world/command.js';
import { HelpCommand } from './help/command.js';

@CommandRouting({
    commands: [
        HelloWorldCommand,
        HelpCommand
    ]
})
export class AppRouting {}