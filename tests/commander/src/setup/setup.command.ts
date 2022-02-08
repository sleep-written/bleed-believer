import { Command, Executable } from '@bleed-believer/commander';

@Command({
    main: 'setup',
    name: 'Setup Project'
})
export class SetupCommand implements Executable {
    start(): void {
        console.log('This is the setup command!');
    }
}