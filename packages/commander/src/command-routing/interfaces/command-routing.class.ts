import { CommandRoute } from './command-route.js';

export type CommandRoutingClass = new () => CommandRoute;
