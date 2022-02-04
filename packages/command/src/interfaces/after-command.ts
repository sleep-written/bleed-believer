import { Argv } from '../tool/arg-parser';

export interface AfterCommand {
    after(argv: Argv): void | Promise<void>;
}
