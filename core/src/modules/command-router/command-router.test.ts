import { assert } from 'chai';

import { BleedModule, Command, CommandMethod } from '../../decorators';
import { BleedBeliever } from '../../bleed-believer';
import { CommandRouter } from './command-router';

describe.only('Testing "./modules/command-router"', () => {
    let backup: string[];
    before(() => {
        backup = process.argv.map(x => x);
    });

    after(() => {
        process.argv = backup.map(x => x);
    });

    it('Basic command router', done => {
        process.argv = [ null, null, 'start' ];

        @Command({
            main: 'start',
            title: 'Start Command'
        })
        class Start {
            @CommandMethod()
            execute() {
                assert.ok(true);
                done();
            }
        }
        
        @BleedModule({
            imports: [
                CommandRouter.letsCum([
                    Start,
                ])
            ]
        })
        class Main {}

        const main = new BleedBeliever(Main);
        main.bleed();
    });

    it('Two commands, launch the second', done => {
        process.argv = [ null, null, 'Command-B' ];

        @Command({
            main: 'command-a',
            title: 'Start Command'
        })
        class CommandA {
            @CommandMethod()
            execute() {
                assert.ok(false);
                done();
            }
        }

        @Command({
            main: 'ComMAnd-b',
            title: 'Start Command'
        })
        class CommandB {
            @CommandMethod()
            execute() {
                assert.ok(true);
                done();
            }
        }
        
        @BleedModule({
            imports: [
                CommandRouter.letsCum([
                    CommandA,
                    CommandB,
                ])
            ]
        })
        class Main {}

        const main = new BleedBeliever(Main);
        main.bleed();
    });
});
