import { Argv, ArgvData, Command, Executable } from '@bleed-believer/commander';

@Command({
    main: 'migration clean ...',
    name: 'TypeORM clean up'
})
export class CleanCommand implements Executable {
    start(argv: Argv, data: ArgvData): void {
        throw new Error('FAIL INTENCIONAL');
    }
}