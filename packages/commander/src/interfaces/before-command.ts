import { Argv } from '../argv';

export interface BeforeCommand {
    before(argv: Argv): void | Promise<void>;
}
