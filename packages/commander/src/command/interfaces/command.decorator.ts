import type { Executable } from './executable.js';

export type CommandDecorator = (
    target: new() => Executable
) => void;
