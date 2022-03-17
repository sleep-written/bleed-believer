import { BeforeCommand } from './before-command';
import { FailedCommand } from './failed-command';
import { AfterCommand } from './after-command';

export type CommandRoute = Partial<
    BeforeCommand &
    FailedCommand &
    AfterCommand
>;
