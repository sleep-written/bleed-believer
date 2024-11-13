import type { Executable } from '@bleed-believer/commander';

import { NodeLauncher } from './node-launcher.js';
import { Command } from '@bleed-believer/commander';

@Command({
    name: 'Start a program',
    path: 'start ...',
    info:
            `Execute your source code, or your transpiled code, using your "tsconfig.json". `
        +   `If you had transpiled your code using another tool (like tsc for example), you `
        +   `can use this command to execute your transpiled code, to resolve the path aliases.`
})
export class StartCommand implements Executable {
    async start(): Promise<void> {
        const nodeLauncher = new NodeLauncher();
        return nodeLauncher.initialize();
    }
}