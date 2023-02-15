import type { AfterCommand } from './after-command.js';
import type { BeforeCommand } from './before-command.js';
import type { FailedCommand } from './failed-command.js';

export type CommandRoute = Partial<
    BeforeCommand &
    AfterCommand &
    FailedCommand
>;
