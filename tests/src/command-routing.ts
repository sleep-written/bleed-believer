import { BleedModule, CommandRouter } from "../../core/dist";
import { HelpCommand } from "./commands/help.command";
import { PendejoCommand } from "./commands/pendejo.command";

@BleedModule({
    imports: [
        CommandRouter.letsCum({
            commands: [
                HelpCommand,
                PendejoCommand,
            ],
            before: () => {
                console.clear();
            }
        })
    ]
})
export class CommandRouting {}
