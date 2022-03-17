import { assert } from 'chai';
import { commandFlatter } from './command-flatter';
import { AppRouting, Nested01Routing } from './command-flatter-example.test';

describe('Testing "@commander/commander/command-flatter"', () => {
    it('Get Nested Route', () => {
        const flatter = commandFlatter(Nested01Routing);
        assert.deepEqual(
            flatter.map(x => x.main),
            [
                ['nested', 'cmd03'],
                ['nested', 'cmd04'],
            ]
        );
    });

    it('Get App Route', () => {
        const flatter = commandFlatter(AppRouting);
        assert.deepEqual(
            flatter.map(x => x.main),
            [
                ['cmd01'],
                ['cmd02'],
                ['nested', 'cmd03'],
                ['nested', 'cmd04'],
            ]
        );
    });
});
