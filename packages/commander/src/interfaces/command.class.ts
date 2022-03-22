import { Executable } from './executable';

export interface CommandClass {
    new(): Executable;
}
