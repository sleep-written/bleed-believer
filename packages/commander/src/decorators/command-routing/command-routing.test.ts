import { assert } from 'chai';

import { CommandRouting, COMMAND_ROUTING } from './command-routing';
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

        const meta = COMMAND_ROUTING.get(Route);
        assert.hasAllKeys(meta, ['main', 'routes', 'commands']);
        assert.sameOrderedMembers(meta.main, ['aaa']);
        assert.sameOrderedMembers(meta.commands, [Command01, Command02]);
    });

    it('Check metadata; options -> Array', () => {
        @CommandRouting({
            commands: [
                Command01,
                Command02
            ]
        })
        class Route { }

        const meta = COMMAND_ROUTING.get(Route);
        assert.hasAllKeys(meta, ['main', 'routes', 'commands']);
        assert.lengthOf(meta.main, 0);
        assert.sameOrderedMembers(meta.commands, [Command01, Command02]);
    });
});