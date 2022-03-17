import { AfterCommand, BeforeCommand, CommandRouting } from '@bleed-believer/commander';
import { CleanCommand } from './clean.command';

import { MigrationCommand } from './migration.command';

@CommandRouting({
    main: 'typeorm',
    commands: [
        CleanCommand,
        MigrationCommand,
    ]
})
export class TypeormRouting implements BeforeCommand, AfterCommand {
    before(): void {
        console.log('>> TypeORM command:');
    }

    after(): void {
        console.log('');
    }
}