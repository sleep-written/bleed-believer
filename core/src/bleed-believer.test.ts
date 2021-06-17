import { assert } from 'chai';
import { bleedAssert } from './bleed-assert';

import { BleedModule } from './decorators';
import { BleedBeliever } from './bleed-believer';
import { InvalidModuleError } from './errors';
import { time } from 'console';

describe('Testing "./bleed-believer"', () => {
    it('Initialize throws an "InvalidModuleError" instance', () => {
        return bleedAssert.throwsAsync(() => {
            class Fake {};

            const root = new BleedBeliever(Fake);
            root.bleed();
        }, InvalidModuleError);
    });

    it('Initialize an empty module', () => {
        return bleedAssert.doesNotThrowAsync(() => {
            @BleedModule()
            class Fake {};

            const root = new BleedBeliever(Fake);
            const refs = root.bleed();
        });
    });

    it('Initialize a tree architecture of modules', () => {
        return bleedAssert.doesNotThrowAsync(() => {
            @BleedModule()
            class NodeC {}

            @BleedModule({
                imports: [ NodeC ]
            })
            class NodeB {}

            @BleedModule()
            class NodeA {}

            @BleedModule({
                imports: [
                    NodeA,
                    NodeB
                ]
            })
            class Main {};

            const root = new BleedBeliever(Main);
            const refs = root.bleed();
            assert.isArray(refs);
            assert.strictEqual(refs.length, 4, 'The amount of modules expected it\'s wrong');
        })
    });
});
