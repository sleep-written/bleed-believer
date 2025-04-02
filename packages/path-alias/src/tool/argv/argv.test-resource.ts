import type { ProcessInstance } from './interfaces/index.js';

import { Argv } from './argv.js';
import test from 'ava';

export class ArgvTestResource {
    #baseDir: string;
    get baseDir(): string {
        return this.#baseDir;
    }

    constructor(baseDir: string) {
        this.#baseDir = baseDir;
    }

    createTest(
        args: string[],
        spec: {
            command: string;
            targetPath: string;
            targetArgs: string[];
        } | Error
    ) {
        const argsFlat = args
            .map(x => JSON.stringify(x))
            .join(', ');

        test(`Check argv -> [ ${argsFlat} ]`, t => {
            const proc: ProcessInstance = {
                cwd: () => this.#baseDir,
                argv: [
                    ...process.argv.slice(0, 2),
                    ...args
                ]
            };
    
            if (spec instanceof Error) {
                t.throws(
                    () => new Argv(proc),
                    { message: spec.message }
                );
            } else {
                const argv: any = new Argv(proc);
                const entries = Object.entries(spec ?? {});
                entries.forEach(([ k, v ]) => {
                    if (v instanceof Array) {
                        t.deepEqual(argv[k], v);
                    }
                });
            }
        });
    }
}
