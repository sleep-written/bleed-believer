import { CommandRouting } from '@bleed-believer/commander';

import { SeedsCommand } from './seeds/command.js';
import { ServerCommand } from './server/command.js';

@CommandRouting({
    commands: [
        SeedsCommand,
        ServerCommand,
    ]
})
export class AppRouting {}