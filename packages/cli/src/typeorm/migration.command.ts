import { Argv, ArgvData, Command, Executable } from '@bleed-believer/commander';

@Command({
    main: 'migration ...',
    name: 'TypeORM migration manager'
})
export class MigrationCommand implements Executable {
    start(argv: Argv, data: ArgvData): void {
        console.log('   data ->', data.items);
    }
}