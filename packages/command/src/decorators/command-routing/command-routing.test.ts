import { Command } from '../command';
import { Executable } from '../../interfaces';
import { CommandRouting } from './command-routing';
import { MetaManager } from 'command/src/tool/meta-manager';

import { COMMAND_ROUTING } from './command-routing';

describe('Testing "@bleed-believer/command/decorators/command-routing"', () => {
    @Command({
        name: 'Command 01',
        main: 'cmd-01'
    })
    class Command01 implements Executable {
        start(): void { }
    }

    @Command({
        name: 'Command 02',
        main: 'cmd-02'
    })
    class Command02 implements Executable {
        start(): void { }
    }

    @Command({
        name: 'Command 03',
        main: 'cmd-03'
    })
    class Command03 implements Executable {
        start(): void { }
    }

    @CommandRouting({
        path: 'orm',
        attach: [
            Command01,
            Command02,
        ]
    })
    class SubRoute { }

    @CommandRouting([
        SubRoute,
        Command03
    ])
    class AppRoute{ }

    it('Check Sub Route', () => {
        const subMeta = new MetaManager(SubRoute).get(COMMAND_ROUTING);
        const appMeta = new MetaManager(SubRoute).get(COMMAND_ROUTING);
    });
});