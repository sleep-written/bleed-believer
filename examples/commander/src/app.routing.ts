import { CommandRouting } from '@bleed-believer/commander';
import { CommandA } from './command-a.js';
import { CommandB } from './command-b.js';

@CommandRouting({
    commands: [
        CommandA,
        CommandB,
    ]
})
export class AppRouting {}
