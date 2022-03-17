import { AfterCommand, BeforeCommand, CommandRouting, FailedCommand } from '@bleed-believer/commander';

import { TypeormRouting } from './typeorm/typeorm.routing';

@CommandRouting({
    routes: [
        TypeormRouting
    ]
})
export class AppRouting implements BeforeCommand, AfterCommand, FailedCommand {
    before(): void {
        console.clear();
        console.log('------------------------');
        console.log('>> @bleed-believer/cli');
        console.log('------------------------\n');
    }
    
    after(): void {
        console.log('          ....          ');
        console.log('-----------<>-----------');
    }

    failed(e: any): void {
        console.log('>> ERROR:');
        console.log('  ', e.message);
    }
}
