import { Argv } from '../argv';

export interface AfterCommand {
    after(argv: Argv): void | Promise<void>;
}
