import { Argv, Command, Executable } from '@bleed-believer/commander';

@Command({
    main: 'build',
    name: ''
})
export class BuildCommand implements Executable {
    start(argv: Argv, data: Record<string, string[]>): void {
        console.log('>> Build.-');
        console.log('   jajaj dale men relax');
    }
}