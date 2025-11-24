import type { ChildProcessObject } from './child-process.object.js';

export interface LauncherInject {
    process?: {
        argv: string[];
    }

    spawn?(
        exe: string,
        args: string[],
        options: { stdio: 'inherit' }
    ): ChildProcessObject;
}