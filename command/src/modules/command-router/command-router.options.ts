import { ClassMeta } from '@bleed-believer/core';

import { CommandMeta } from '../../decorators/command/command.meta';
import { Action } from '../../interfaces';
import { Fail } from '../../interfaces/fail';

/**
 * A interface with the options accepted by the `CommandRouter` module class.
 */
export interface CommandRouterOptions {
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

    /**
     * A method to show a custom message when the CommandRouter module emits an error.
     */
    error?: Fail;
}
