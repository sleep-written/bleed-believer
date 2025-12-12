import { CommandRouting } from '@bleed-believer/commander';

import { HelloWorldCommand } from './hello-world/command.ts';
import { HelpCommand } from './help/command.ts';

@CommandRouting({
    commands: [
        HelloWorldCommand,
        HelpCommand
    ]
})
export class AppRouting {}