import { BeforeCommand, CommandRouting, FailedCommand } from '@bleed-believer/command';

import { SetupCommand } from './setup';
import { TestCommand } from './test';

@CommandRouting({
    commands: [
        SetupCommand,
        TestCommand,
    ]
})
export class AppRouting implements BeforeCommand, FailedCommand {
    before(): void {
        console.clear();
        console.log('>> Test APP.-');
        console.log('\n'.padStart(70, '-'));
    }

    failed(e: Error): void {
        console.log('>> ERROR:');
        console.log(e.message + '\n');
    }
}
