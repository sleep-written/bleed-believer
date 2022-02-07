import { assert } from 'chai';

import { ArgParser } from '../tool/arg-parser';
import { CheckRoute } from './check-route';
import { CommandRouting } from '../decorators';

describe('Testing @bleed-believer/command/commander/check-route', () => {
    describe('Successful cases:', () => {
        it('Case 01', () => {
            @CommandRouting({
                main: '',
                commands: []
            })
            class Route { }

            const argv = new ArgParser([]);
            const comp = new CheckRoute(argv);
            const resp = comp.eval(Route);

            assert.isNotNull(resp);
            assert.isArray(resp);
            assert.lengthOf(resp as string[], 0);
        });

        it('Case 02', () => {
            @CommandRouting({
                main: '',
                commands: []
            })
            class Route { }

            const argv = new ArgParser(['orm', 'migration', 'generate', '-n', 'New-DB']);
            const comp = new CheckRoute(argv);
            const resp = comp.eval(Route);

            assert.isNotNull(resp);
            assert.isArray(resp);
            assert.lengthOf(resp as string[], 3);
        });
    
        it('Case 03', () => {
            @CommandRouting({
                main: 'hello world',
                commands: []
            })
            class Route { }
    
            const argv = new ArgParser(['hello', 'world']);
            const comp = new CheckRoute(argv);
            const resp = comp.eval(Route);
    
            assert.isNotNull(resp);
            assert.isArray(resp);
            assert.lengthOf(resp as string[], 0);
        });
    
        it('Case 04', () => {
            @CommandRouting({
                main: 'orm',
                commands: []
            })
            class Route { }

            const argv = new ArgParser(['orm', 'migration', 'generate', '-n', 'New-DB']);
            const comp = new CheckRoute(argv);
            const resp = comp.eval(Route);

            assert.isNotNull(resp);
            assert.isArray(resp);
            assert.lengthOf(resp as string[], 2);
        });
    });

    describe('Failed cases:', () => {
        it('Case 01', () => {
            @CommandRouting({
                main: 'hello',
                commands: []
            })
            class Route { }

            const argv = new ArgParser([]);
            const comp = new CheckRoute(argv);
            const resp = comp.eval(Route);

            assert.isNull(resp);
        });

        it('Case 02', () => {
            @CommandRouting({
                main: 'hello world',
                commands: []
            })
            class Route { }

            const argv = new ArgParser(['hello', 'WORLD']);
            const comp = new CheckRoute(argv);
            const resp = comp.eval(Route);

            assert.isNull(resp);
        });
    
        it('Case 03', () => {
            @CommandRouting({
                main: 'hello world',
                commands: []
            })
            class Route { }

            const argv = new ArgParser(['orm', 'migration', 'generate', '-n', 'New-DB']);
            const comp = new CheckRoute(argv);
            const resp = comp.eval(Route);

            assert.isNull(resp);
        });
    });
});
