import { Command, Executable } from '@bleed-believer/commander';

@Command({
    main: 'test',
    name: 'Test Project'
})
export class TestCommand implements Executable {
    start(): void {
        console.log('This is the test command!');
    }
}