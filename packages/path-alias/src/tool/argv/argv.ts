import type { ProcessInstance } from './interfaces/index.js';

import path from 'path';

export class Argv {
    #command: string;
    get command(): string {
        return this.#command;
    }

    #targetPath: string;
    get targetPath(): string {
        return this.#targetPath;
    }

    #targetArgs: string[];
    get targetArgs(): string[] {
        return this.#targetArgs.slice();
    }

    constructor(processInstance?: ProcessInstance) {
        const proc = processInstance ?? process;
        this.#command = proc.argv[2];
        if (typeof this.#command !== 'string') {
            throw new Error('No command provided.');

        }

        this.#targetPath = proc.argv[3];
        if (typeof this.#targetPath !== 'string') {
            throw new Error('No file target provided.');

        } else if (!path.isAbsolute(this.#targetPath)) {
            this.#targetPath = path.resolve(
                proc.cwd(),
                this.#targetPath
            );

        }

        this.#targetArgs = proc.argv.slice(4);
    }
}