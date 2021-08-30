import { assert } from 'chai';

import { BleedModule, Inject } from './decorators';
import { InvalidModuleError } from './errors';
import { BleedBeliever } from './bleed-believer';
import { bleedAssert } from './bleed-assert';

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
            root.bleed();
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
            assert.isArray(refs.imports);
            assert.strictEqual(refs.imports.length, 2, 'The amount of modules expected it\'s wrong');
        })
    });

    it('Test export 01', () => {
        @BleedModule()
        class ModuleD {
            private static __i = 0;
            private _i: number;

            constructor() {
                this._i = ModuleD.__i++;
            }

            toString(): string {
                return `My index is ${this._i}`;
            }
        }

        @BleedModule()
        class ModuleC {
            private static __i = 0;
            private _i: number;
            get i(): number {
                return this._i;
            }

            constructor() {
                this._i = ModuleC.__i++;
            }
        }
        
        @BleedModule({
            imports: [ ModuleC, ModuleD ],
            exports: [ ModuleD ]
        })
        class ModuleB {
            private static __i = 0;
            private _i: number;
            get i(): number {
                return this._i;
            }

            constructor() {
                this._i = ModuleB.__i++;
            }
        }
        
        @BleedModule()
        class ModuleA {
            private static __i = 0;
            private _i: number;
            get i(): number {
                return this._i;
            }

            constructor() {
                this._i = ModuleA.__i++;
            }
        }

        @BleedModule({
            imports: [
                ModuleA,
                ModuleB
            ]
        })
        class RootModule {
            constructor(
                @Inject(ModuleD) public moduleD: ModuleD
            ) {}
        }

        const root = new BleedBeliever(RootModule);
        const resp = root.bleed();
        assert.strictEqual('My index is 0', resp.current.moduleD.toString());
    });

    it('Test Export 02', () => {
        const ids: number[] = [];

        @BleedModule()
        class ModuleD {
            private static __i__ = 0;
            private _id: number;
            get id(): number {
                return this._id;
            }

            constructor() {
                this._id = ModuleD.__i__++;
            }
        }

        @BleedModule({
            imports: [ ModuleD ],
            exports: [ ModuleD ]
        })
        class ModuleC {
            constructor(
                @Inject(ModuleD) public moduleD: ModuleD
            ) {
                ids.push(this.moduleD.id);
            }
        }

        @BleedModule({
            imports: [ ModuleC ],
            exports: [ ModuleD ]
        })
        class ModuleB {}

        @BleedModule({
            imports: [ ModuleB ]
        })
        class ModuleA {
            constructor(
                @Inject(ModuleD) public moduleD: ModuleD
            ) {
                ids.push(this.moduleD.id);
            }
        }

        const core = new BleedBeliever(ModuleA);
        const resp = core.bleed();

        assert.isArray(resp.imports);
        assert.isArray(resp.exports);
        assert.lengthOf(resp.imports, 1);
        assert.lengthOf(resp.exports, 0);
        assert.lengthOf(ids, 2);

        for (const id of ids) {
            assert.strictEqual(id, 0);
        }
    }).timeout(Number.MAX_SAFE_INTEGER);
});
