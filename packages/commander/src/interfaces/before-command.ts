import { Argv } from '../tool/arg-parser';

export interface BeforeCommand {
    before(argv: Argv): void | Promise<void>;
}
