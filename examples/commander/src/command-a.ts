import { Command, Executable } from '@bleed-believer/commander';

@Command({
    name: 'command-a',
    path: 'command-a'
})
export class CommandA implements Executable {
    start(): void {
        console.log('Command "A".-');
    }
}