import type { ChildProcessInstance } from './child-process.instance.js';
import type { SpawnOptions, SpawnOptionsWithoutStdio } from 'child_process';

export type SpawnFunction =
    ((program: string, options: SpawnOptionsWithoutStdio) => ChildProcessInstance) |
    ((program: string, args: string[], options?: SpawnOptions) => ChildProcessInstance);