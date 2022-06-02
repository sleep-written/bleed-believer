import { AfterCommand } from './after-command.js';
import { BeforeCommand } from './before-command.js';
import { FailedCommand } from './failed-command.js';

export type CommandRoute = Partial<
    BeforeCommand &
    AfterCommand &
    FailedCommand
>;
