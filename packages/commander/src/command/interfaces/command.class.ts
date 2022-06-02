import { Executable } from './executable.js';

export type CommandClass = new () => Executable;
