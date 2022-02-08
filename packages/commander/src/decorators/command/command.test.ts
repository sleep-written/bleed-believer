import { assert } from 'chai';

import { Executable } from '../../interfaces';
import { Command, COMMAND } from './command';

describe('Testing "/command/decorators/command"', () => {
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
        
        const meta = COMMAND.get(TestCommand);
        assert.hasAllKeys(meta, ['main', 'name', 'info']);
        assert.sameMembers(meta.main, ['start']);
        assert.strictEqual(meta.name, 'Start Server');
        assert.strictEqual(meta.info, 'Not available.');
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
        
        const meta = COMMAND.get(TestCommand);
        assert.hasAllKeys(meta, ['main', 'name', 'info']);
        assert.sameMembers(meta.main, ['orm', 'migration', ':args']);
        assert.strictEqual(meta.name, 'Migration Manager');
        assert.strictEqual(meta.info, 'Test information.');
    });
});
