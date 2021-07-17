import { CommandMeta } from '../../decorators/command/command.meta';
import { ClassMeta, Action } from '../../interfaces';

/**
 * A interface with the options accepted by the `CommandRouter` module class.
 */
export interface CommandRouterOptions {
    /**
     * A method to show a custom message when the command typed by the user doesn't found  by the router
     */
    notFound?: Action;

    /**
     * The commands to add into the command router.
     */
    commands: ClassMeta<CommandMeta>[];

    /**
     * A generic action to be executed always before execute the command queue attached to the command router.
     */
    before?: Action;

    /**
     * A generic action to be executed always after execute the command queue attached to the command router.
     */
    after?: Action;
}
