import type { ChildProcessInstance } from './interfaces/index.js';

import { ChildProcessFake } from './child-process.fake.js';

export class SpawnFake {
    #error?: Error;

    #spawnArgs: string[] = [];
    get spawnArgs(): string[] {
        return this.#spawnArgs.slice();
    }

    constructor(error?: Error) {
        this.#error = error;
    }

    spawn(program: string, args: string[]): ChildProcessInstance {
        this.#spawnArgs = [ program, ...args ];
        const child = new ChildProcessFake();

        setTimeout(() => {
            if (this.#error) {
                child.invoke('error', this.#error);
            } else {
                child.invoke('close');
            }
        }, 1000);

        return child;
    }
}