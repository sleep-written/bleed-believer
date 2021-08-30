import { CommandNotFoundError, CommandRouter } from '@bleed-believer/command';
import { BleedModule } from '@bleed-believer/core';

import { PendejoCommand } from './commands/pendejo.command';
import { CountCommand } from './commands/count.command';
import { HelpCommand } from './commands/help.command';
import { RootCommand } from './commands/root.command';

@BleedModule({
    imports: [
        CommandRouter.addToRouter({
            commands: [
                PendejoCommand,
                CountCommand,
                HelpCommand,
                RootCommand,
            ],
            before: () => {
                console.clear();
                console.log('>> BleedBeliever v0.0.1');
                console.log('--------------------------\n');
            },
            error: err => {
                if (err instanceof CommandNotFoundError) {
                    console.log(`The command "${err.args.toString()}" doesn't exists.`);
                } else {
                    console.error(err);
                }
            }
        })
    ]
})
export class CommandRouting {}
