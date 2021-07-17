import { ClassMeta } from "../../interfaces";
import { BleedModule } from "../../decorators";
import { CommandMeta } from "../../decorators/command/command.meta";
import { Args } from "../../tool/args/args";
import { CommandRouterMeta } from "./command-router.meta";
import { CommandRouterOptions } from "./command-router.options";
import { CommandNotFoundError } from "../../errors";

@BleedModule({
    imports: [],
    exports: [],
})
export class CommandRouter {
    /**
     * Create a new routing module for commands usign the the `@Command` decorator.
     * @param commands An array with the command classes declared using the `@Command` decorator.
     */
    static addToRouter(commands: ClassMeta<CommandMeta>[]): ClassMeta<CommandRouterMeta>;
    /**
     * Create a new routing module for commands usign the the `@Command` decorator.
     * @param options An object with options to configure the command router.
     */
    static addToRouter(options: CommandRouterOptions): ClassMeta<CommandRouterMeta>;
    static addToRouter(input: CommandRouterOptions | ClassMeta<CommandMeta>[]): ClassMeta<CommandRouterMeta> {
        const ref: ClassMeta<CommandRouterMeta> = CommandRouter;        
        ref.__meta__.queue = [];
        
        const args = new Args();
        ref.__meta__.args = args;

        let commands: ClassMeta<CommandMeta>[];
        if (input instanceof Array) {
            commands = input;
        } else {
            commands = input.commands;
            ref.__meta__.notFound = input.notFound;
            ref.__meta__.before = input.before;
            ref.__meta__.after = input.after;
        }
        
        for (const command of commands) {
            if (command.__meta__.main.length <= args.main.length) {
                // Iterate for all
                let found = true;
                for (let i = 0; i < command.__meta__.main.length; i++) {
                    const a = command.__meta__.main[i];
                    const b = args.main[i].trim().toLowerCase();

                    if (
                        (a !== b) &&
                        (!a.match(/^:[^:]+$/gi))
                    ) {
                        found = false;
                        break;
                    }
                }

                // Add to the queue
                if (found) {
                    ref.__meta__.queue.push(command);
                }
            }
        }

        return ref;
    }

    constructor() {
        this.execute();
    }

    async execute(): Promise<void> {
        const proto = Object.getPrototypeOf(this);
        const meta = proto.constructor?.__meta__ as CommandRouterMeta;

        try {
            // Check not found
            if (meta.queue.length === 0) {
                throw new CommandNotFoundError();
            }
    
            // Before process
            if (meta.before) {
                await meta.before(meta.args);
            }
    
            // Execute commands
            for (const command of meta.queue) {
                const actions = Object.values(command.__meta__.methods);
                for (const action of actions) {
                    await action.value(meta.args);
                }
            }
    
            // After process
            if (meta.after) {
                await meta.after(meta.args);
            }
        } catch (err) {
            if (
                (meta.notFound) &&
                (err instanceof CommandNotFoundError)
            ) {
                // Detect command not found
                await meta.notFound(meta.args);
            } else {
                // Generic Error
                console.error(err);
                process.exit(666);
            }
        }
    }
}
