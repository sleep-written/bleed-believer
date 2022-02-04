import { AfterCommand } from './after-command';
import { BeforeCommand } from './before-command';
import { FailedCommand } from './failed-command';

export type CommandRoute = Partial<
    AfterCommand |
    BeforeCommand |
    FailedCommand
>;