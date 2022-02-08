import { Argv, ArgvData, Command, Executable } from '@bleed-believer/commander';

@Command({
    main: 'test app ...args',
    name: 'Test Project'
})
export class TestCommand implements Executable {
    start(argv: Argv, data: ArgvData): void {
        console.log('Args:', data.items);
    }
}