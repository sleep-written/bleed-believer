import { assert } from 'chai';
import { MetaManager } from './meta-manager';

describe('Testing "@bleed-believer/command/tool/meta-manager"', () => {
    class Target {
        private _n = 0;
        next(): number {
            return ++this._n;
        }
    }

    interface Meta {
        id: number;
        name: string;
    }

    const manager = new MetaManager(Target);
    const META_KEY = Symbol('meta-key');

    it('Doesn\'t have metadata.', () => {
        const meta = manager.get<Meta>(META_KEY);
        assert.isNull(meta);
    });

    it('Insert metadata.', () => {
        manager.set<Meta>(META_KEY, {
            id: 666,
            name: 'joder chaval'
        });
    });

    it('Read metadata.', () => {
        const meta = manager.get<Meta>(META_KEY);
        assert.isNotNull(meta);
        assert.hasAllKeys(meta, ['id', 'name']);
        assert.strictEqual(meta?.id, 666);
        assert.strictEqual(meta?.name, 'joder chaval');
    });
    
    it('Delete metadata.', () => {
        manager.del(META_KEY);
        const meta = manager.get<Meta>(META_KEY);
        assert.isNull(meta);
    });
});
