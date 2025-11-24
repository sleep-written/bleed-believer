import type { LauncherInject } from './interfaces/index.js';
import { spawn } from 'child_process';

export class Launcher {
    #args: string[];
    #target: string;
    #inject: Required<LauncherInject>;

    constructor(target: string, args?: string[], inject?: LauncherInject) {
        this.#args   = args?.slice() ?? [];
        this.#target = target;
        this.#inject = {
            process:    inject?.process             ?? process,
            spawn:      inject?.spawn?.bind(inject) ?? spawn
        };
    }

    execute(watch?: boolean): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const args = [
                '--import',
                '@bleed-believer/cli',
                this.#target, ...this.#args
            ];

            if (watch) {
                args.unshift('--watch');
            }

            const exe = this.#inject.process.argv[0];
            const cmd = this.#inject.spawn(exe, args, { stdio: 'inherit' });

            cmd.once('exit',  () => resolve());
            cmd.once('close', () => resolve());
            cmd.once('error', er => reject(er));
        });
    }
}