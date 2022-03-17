import { Argv, ArgvData } from '../argv';

export interface Executable {
    start(argv: Argv, data: ArgvData): void | Promise<void>;
}
