import { assert } from 'chai';

import { Executable } from '../../interfaces';
import { CommandMeta } from './command.meta';
import { Command, COMMAND_META } from './command';

describe('Testing "@bleed-believer/command/decorators/command"', () => {
    it('Command 01.', () => {
        @Command({
            main: 'start',
            name: 'Start Server'
        })
        class TestCommand implements Executable {
            start(): void {
                throw new Error('Method not implemented.');
            }
        }
        
        const meta = (TestCommand as any)['__meta__'];
        const comm = meta[COMMAND_META] as CommandMeta;

        assert.hasAllKeys(comm, ['main', 'name', 'info']);
        assert.sameMembers(comm.main, ['start']);
        assert.strictEqual(comm.name, 'Start Server');
        assert.strictEqual(comm.info, 'Not available.');
    });
    
    it('Command 02.', () => {
        @Command({
            main: 'orm migration :args',
            name: 'Migration Manager',
            info: 'Test information.'
        })
        class TestCommand implements Executable {
            start(): void {
                throw new Error('Method not implemented.');
            }
        }
        
        const meta = (TestCommand as any)['__meta__'];
        const comm = meta[COMMAND_META] as CommandMeta;

        assert.hasAllKeys(comm, ['main', 'name', 'info']);
        assert.sameMembers(comm.main, ['orm', 'migration', ':args']);
        assert.strictEqual(comm.name, 'Migration Manager');
        assert.strictEqual(comm.info, 'Test information.');
    });
});
