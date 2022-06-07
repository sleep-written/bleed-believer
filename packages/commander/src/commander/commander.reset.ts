import { Commander, COMMANDER } from './commander.js';

export function commanderReset(argv: string[]): void {
    COMMANDER.set(Commander, {
        instantiated: false,
        rawArgv: argv
    });
}