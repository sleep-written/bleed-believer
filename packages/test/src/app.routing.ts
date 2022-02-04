import { BeforeCommand, CommandRouting } from '@bleed-believer/command';

import { SetupCommand } from './setup';
import { TestCommand } from './test';

@CommandRouting({
    attach: [
        SetupCommand,
        TestCommand,
    ]
})
export class AppRouting implements BeforeCommand {
    before(): void {
        console.clear();
        console.log('<< Test APP >>\n');
    }
}
