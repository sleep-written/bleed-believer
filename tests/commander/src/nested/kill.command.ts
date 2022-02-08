import { Argv, Command, Executable, ArgvData } from '@bleed-believer/commander';

@Command({
    main: 'kill :pid',
    name: ''
})
export class KillCommand implements Executable {
    start(argv: Argv, data: ArgvData): void {
        console.log('>> Task Kill.-');
        console.log('   PID:', data.param?.pid);
    }
}