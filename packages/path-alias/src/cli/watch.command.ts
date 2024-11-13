import type { Executable } from '@bleed-believer/commander';

import { NodeLauncher } from './node-launcher.js';
import { Command } from '@bleed-believer/commander';
import chalk from 'chalk';

@Command({
    name: 'Start a program and watch changes',
    path: 'watch ...',
    info:
            `Execute your source code, or your transpiled code, using your "tsconfig.json" `
        +   `with the ${chalk.greenBright(`--watch`)} flag. If you had transpiled your `
        +   `code using another tool (like tsc for example), you can use this command `
        +   `to execute your transpiled code, to resolve the path aliases.`
})
export class WatchCommand implements Executable {
    async start(): Promise<void> {
        const nodeLauncher = new NodeLauncher(true);
        return nodeLauncher.initialize();
    }
}