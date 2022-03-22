import { Argv } from '../argv';

export interface BeforeCommand {
    /**
     * If the `Command` class is found, this method will be executed __before__
     * to make an instance of that `Command` class. Else if this method is part
     * of the root `CommandRouting` class, this method will be called before to
     * search the `Command` class.
     * @param argv An object with all Argv data parsed.
     */
    before(argv: Argv): void | Promise<void>;
}
