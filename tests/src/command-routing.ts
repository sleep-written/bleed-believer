import { BleedModule, CommandRouter } from "../../core/dist";
import { PendejoCommand } from "./commands/pendejo.command";
import { HelpCommand } from "./commands/help.command";
import { CountCommand } from "./commands/count.command";

@BleedModule({
    imports: [
        CommandRouter.addToRouter([
            HelpCommand,
            CountCommand,
            PendejoCommand,
        ])
    ]
})
export class CommandRouting {}
