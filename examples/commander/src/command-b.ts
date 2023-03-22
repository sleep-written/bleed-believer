import { Command, Executable } from '@bleed-believer/commander';

@Command({
    name: 'command-b',
    path: 'command-b'
})
export class CommandB implements Executable {
    start(): void {
        console.log('Command "B".-');
    }
}