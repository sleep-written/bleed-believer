import { assert } from 'chai';
import { ClassMeta } from '../../interfaces';
import { BleedModule } from './bleed-module.function';
import { BleedModuleMeta } from './bleed-module.meta';

describe('Testing "./decorators/bleed-module"', () => {
    it('Create an empty module', () => {
        @BleedModule()
        class Fake {}

        const meta = (Fake as ClassMeta<BleedModuleMeta>).__meta__;
        assert.exists(meta);
        assert.isArray(meta?.imports);
        assert.isArray(meta?.exports);
    });

    it('Create a module: 2 imports; 2 exports', () => {
        @BleedModule()
        class Class01 {}
        
        @BleedModule()
        class Class02 {}

        @BleedModule()
        class Class03 {}
        
        @BleedModule()
        class Class04 {}

        @BleedModule({
            imports: [ Class01, Class02 ],
            exports: [ Class03, Class04 ],
        })
        class Fake {}

        const meta = (Fake as ClassMeta<BleedModuleMeta>).__meta__;
        assert.exists(meta);
        assert.isArray(meta?.imports);
        assert.isArray(meta?.exports);
        assert.lengthOf(meta?.imports, 2);
        assert.lengthOf(meta?.exports, 2);
    });
});
