import { assert } from "chai";
import { Command } from "./command.function";
import { CommandMeta } from "./command.meta";

describe('Testing "./decorators/command"', () => {
    it('New "Command" class', () => {
        @Command({
            main: [ 'hello', 'bitches' ],
            title: 'hello world command'
        })
        class Fake { }

        const meta: CommandMeta = (Fake as any)?.__meta__;
        assert.isDefined(meta);
        assert.hasAllKeys(meta, [ 'main', 'title', 'description', 'methods' ]);
        assert.instanceOf(meta.main, Array);
        assert.lengthOf(meta.main, 2);
        assert.strictEqual(meta.main[0], 'hello');
        assert.strictEqual(meta.main[1], 'bitches');
        assert.strictEqual(meta.title, 'hello world command');
        assert.exists(meta.description);
        assert.isEmpty(meta.methods);
    });

    it('New "Command" class with uppercase main (one string)', () => {
        @Command({
            main: 'HELLO BITCHES',
            title: 'Ahahahah'
        })
        class Fake { }

        const meta: CommandMeta = (Fake as any)?.__meta__;
        assert.isDefined(meta);
        assert.hasAllKeys(meta, [ 'main', 'title', 'description', 'methods' ]);
        assert.instanceOf(meta.main, Array);
        assert.lengthOf(meta.main, 2);
        assert.strictEqual(meta.main[0], 'hello');
        assert.strictEqual(meta.main[1], 'bitches');
        assert.strictEqual(meta.title, 'Ahahahah');
        assert.exists(meta.description);
        assert.isEmpty(meta.methods);
    });

    it('New "Command" class with uppercase main (with array)', () => {
        @Command({
            main: [ 'HELLO BITCHES' ],
            title: 'Ahahahah'
        })
        class Fake { }

        const meta: CommandMeta = (Fake as any)?.__meta__;
        assert.isDefined(meta);
        assert.hasAllKeys(meta, [ 'main', 'title', 'description', 'methods' ]);
        assert.instanceOf(meta.main, Array);
        assert.lengthOf(meta.main, 1);
        assert.strictEqual(meta.main[0], 'hello bitches');
        assert.strictEqual(meta.title, 'Ahahahah');
        assert.exists(meta.description);
        assert.isEmpty(meta.methods);
    });
});