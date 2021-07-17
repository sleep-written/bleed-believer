import { BleedModule, CommandRouter } from "../../core/dist";
import { HelpCommand } from "./commands/help.command";
import { PendejoCommand } from "./commands/pendejo.command";

@BleedModule({
    imports: [
        CommandRouter.addToRouter([
            HelpCommand,
            PendejoCommand,
        ])
    ]
})
export class CommandRouting {}