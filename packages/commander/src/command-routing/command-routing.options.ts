import { CommandClass, CommandRoutingClass } from '../interfaces';

export interface CommandRoutingOptions {
    /**
     * The required arguments to match with the __execution arguments__.
     * This sort of required arguments will be used as prefix for all
     * descendants of this `CommandRouting` class.
     */
    main?: string;

    /**
     * The `CommandRoute` classes that you want to attach as nested
     * routes, relatives to the current target class.
     */
    routes?: CommandRoutingClass[];

    /**
     * The `Command` classes that you want to attach to this target
     * class.
     */
    commands?: CommandClass[];
}
