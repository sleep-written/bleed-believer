import { BeforeCommand } from './before-command';
import { FailedCommand } from './failed-command';
import { AfterCommand } from './after-command';

export interface CommandRoutingClass {
    new(): Partial<
        BeforeCommand &
        FailedCommand &
        AfterCommand
    >;
}
