import { Args } from "../tool/args-parser";

/**
 * A generic function, with one optional parameter _(a instence of `Args` class)_.
 * This function only can return `void` _(for synchronous operations)_, or a
 * `Promise<void>` instance _(for asynchronous operations)_.
 */
export type Action = (args?: Args) => void | Promise<void>;
