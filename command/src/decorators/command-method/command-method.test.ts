import { assert } from 'chai';
import { Command } from '../command';
import { CommandMethod } from './command-method.function';
import { CommandMethodMeta } from './command-method.meta';

describe('Testing "./decorators/command-method"', () => {
    it('Basic class with a method', () => {
        @Command({
            main: '',
            title: 'Base'
        })
        class Target {
            @CommandMethod()
            execution01() {
                console.log('kill yourself');
            }

            @CommandMethod()
            execution02() {
                console.log('kill yourself again');
            }
        }

        const meta: CommandMethodMeta = (Target as any).__meta__;
        assert.hasAllKeys(meta, [ 'main', 'title', 'description', 'methods' ]);
        assert.hasAllKeys(meta.methods, [ 'execution01', 'execution02' ]);
    });
});