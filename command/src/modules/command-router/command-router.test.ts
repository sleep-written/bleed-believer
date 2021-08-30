import { BleedBeliever, BleedModule } from '@bleed-believer/core';
import { assert } from 'chai';

import { Command, CommandMethod } from '../../decorators';
import { CommandRouter } from './command-router';

describe('Testing "./modules/command-router"', () => {
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
                CommandRouter.addToRouter([
                    Start,
                ])
            ]
        })
        class Main {}

        const main = new BleedBeliever(Main);
        main.bleed();
    });

    it('2 commands, launch the second', done => {
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
                CommandRouter.addToRouter([
                    CommandA,
                    CommandB,
                ])
            ]
        })
        class Main {}

        const main = new BleedBeliever(Main);
        main.bleed();
    });

    it('3 commands, argv = [ null, null ]', done => {
        process.argv = [ null, null ];

        // Implementar escenario
        @Command({
            main : '',
            title: 'Base'
        })
        class BaseCommand {
            @CommandMethod()
            start() {
                done();
            }
        }

        @Command({
            main: 'start',
            title: 'start'
        })
        class StartCommand {
            @CommandMethod()
            start() {
                throw new Error('Wrong Command');
            }
        }

        @Command({
            main: [ 'start', 'server' ],
            title: 'start server'
        })
        class StartServerCommand {
            @CommandMethod()
            start() {
                throw new Error('Wrong Command');
            }
        }

        @BleedModule({
            imports: [
                CommandRouter.addToRouter({
                    commands: [
                        BaseCommand,
                        StartCommand,
                        StartServerCommand,
                    ]
                })
            ]
        })
        class MainModule { }

        // Ejecutar
        const main = new BleedBeliever(MainModule);
        main.bleed();
    });

    it('3 commands, argv = [ null, null, "start" ]', done => {
        process.argv = [ null, null, 'start' ];

        // Implementar escenario
        @Command({
            main : '',
            title: 'Base'
        })
        class BaseCommand {
            @CommandMethod()
            start() {
                throw new Error('Wrong Command');
            }
        }

        @Command({
            main: 'start',
            title: 'start'
        })
        class StartCommand {
            @CommandMethod()
            start() {
                done();
            }
        }

        @Command({
            main: [ 'start', 'server' ],
            title: 'start server'
        })
        class StartServerCommand {
            @CommandMethod()
            start() {
                throw new Error('Wrong Command');
            }
        }

        @BleedModule({
            imports: [
                CommandRouter.addToRouter({
                    commands: [
                        BaseCommand,
                        StartCommand,
                        StartServerCommand,
                    ]
                })
            ]
        })
        class MainModule { }

        // Ejecutar
        const main = new BleedBeliever(MainModule);
        main.bleed();
    });
});
