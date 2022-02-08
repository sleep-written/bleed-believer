import { ArgvData } from './argv-data';
import { Argv } from '../tool/arg-parser';

export interface Executable {
    start(argv: Argv, data: ArgvData): void | Promise<void>;
}