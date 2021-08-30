import { ClassMeta, BleedModule } from '@bleed-believer/core';

import { ArgsParser } from '../../tool/args-parser';
import { ArgsComparer } from '../../tool/args-comparer';

import { CommandMeta } from '../../decorators/command/command.meta';
import { CommandRouterMeta } from './command-router.meta';
import { CommandRouterOptions } from './command-router.options';
import { CommandNotFoundError } from '../../errors';

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
        
        const args = new ArgsParser();
        ref.__meta__.args = args;

        let commands: ClassMeta<CommandMeta>[];
        if (input instanceof Array) {
            commands = input;
        } else {
            commands = input.commands;
            ref.__meta__.before = input.before;
            ref.__meta__.after = input.after;
            ref.__meta__.error = input.error;
        }
        
        for (const command of commands) {
            const exp = new ArgsParser(command?.__meta__?.main ?? []);
            const obj = new ArgsComparer(exp, args);

            if (obj.isSimilar()) {
                ref.__meta__.queue.push(command);
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
            // Before process
            if (meta.before) {
                await meta.before(meta.args);
            }

            // Check not found
            if (meta.queue.length === 0) {
                throw new CommandNotFoundError(meta.args);
            }
    
            // Execute commands
            for (const command of meta.queue) {
                const instance = new command();

                const actions = Object.values(command.__meta__.methods);
                for (const action of actions) {
                    const key = action.value.name;
                    await instance[key](meta.args);
                }
            }
    
            // After process
            if (meta.after) {
                await meta.after(meta.args);
            }
        } catch (err) {
            if (meta.error && err instanceof Error) {
                // Detect command not found
                await meta.error(err);
            } else {
                // Generic Error
                console.error(err);
                process.exit(666);
            }
        }
    }
}
