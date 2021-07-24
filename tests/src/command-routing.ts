import { BleedModule, CommandRouter } from "../../core/dist";
import { PendejoCommand } from "./commands/pendejo.command";
import { HelpCommand } from "./commands/help.command";

@BleedModule({
    imports: [
        CommandRouter.addToRouter([
            HelpCommand,
            PendejoCommand,
        ])
    ]
})
export class CommandRouting {}
