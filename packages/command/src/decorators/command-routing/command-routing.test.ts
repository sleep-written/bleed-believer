import { assert } from 'chai';

import { CommandRouting, COMMAND_ROUTING_META } from './command-routing';
import { CommandRoutingMeta } from './command-routing.meta';
import { MetaManager } from '../../tool/meta-manager';
import { Executable } from '../../interfaces';
import { Command } from '../command';


describe('Testing "/command/decorators/command-routing"', () => {
    @Command({
        main: 'hello world',
        name: 'Greetings'
    })
    class Command01 implements Executable {
        start(): void { }
    }

    @Command({
        main: 'kill :pid',
        name: 'Task Kill'
    })
    class Command02 implements Executable {
        start(): void { }
    }

    it('Check metadata; options -> Object', () => {
        @CommandRouting({
            main: 'aaa',
            commands: [
                Command01,
                Command02
            ]
        })
        class Route { }

        const manag = new MetaManager(Route);
        const metad = manag.get<CommandRoutingMeta>(COMMAND_ROUTING_META);
        
        assert.hasAllKeys(metad, ['main', 'routes', 'commands']);
        assert.sameOrderedMembers(metad.main, ['aaa']);
        assert.sameOrderedMembers(metad.commands, [Command01, Command02]);
    });

    it('Check metadata; options -> Array', () => {
        @CommandRouting({
            commands: [
                Command01,
                Command02
            ]
        })
        class Route { }

        const manag = new MetaManager(Route);
        const metad = manag.get<CommandRoutingMeta>(COMMAND_ROUTING_META);
        
        assert.hasAllKeys(metad, ['main', 'routes', 'commands']);
        assert.lengthOf(metad.main, 0);
        assert.sameOrderedMembers(metad.commands, [Command01, Command02]);
    });
});