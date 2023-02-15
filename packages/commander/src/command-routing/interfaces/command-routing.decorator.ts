import type { CommandRoute } from './command-route.js';

export type CommandRoutingDecorator = (
    target: new() => CommandRoute
) => void;
