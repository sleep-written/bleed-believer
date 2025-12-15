import type { TSConfigInject, TsConfigValue } from '@lib/ts-config/index.js';
import type { ImportTransformerInject } from './interfaces/index.js';

import { ImportTransformer } from './import-transformer.js';
import test from 'ava';

class Inject implements ImportTransformerInject, TSConfigInject {
    #filesystem: string[];

    process: { cwd(): string; };

    constructor(cwd: string, filesystem: string[]) {
        this.#filesystem = filesystem;
        this.process = {
            cwd: () => cwd
        };
    }

    access(path: string): void {
        if (!this.#filesystem.includes(path)) {
            throw new Error();
        }
    }
}

test('Simple test', t => {
    // Build context
    const inject = new Inject(
        '/path/to/project',
        [
            '/path/to/project/src/index.ts',
            '/path/to/project/src/brainrots/index.ts',
        ]
    );

    const tsConfigValue: TsConfigValue = {
        compilerOptions: {
            outDir: 'dist',
            rootDir: 'src',
            baseUrl: 'src',

            // To enable ts import extensions
            allowImportingTsExtensions: true
        }
    };

    const input = [
        `import { Tralalero, Tralala } from './brainrots/index.ts';`,
        `import ñeee from 'sparkle/laugh.ts';`,
        `import reee from '#root/reee.ts';`,
    ].join('\n');

    // Execute test
    const transformer = new ImportTransformer(tsConfigValue, inject);
    const output = transformer.transform(input, '/path/to/project/src/index.ts');

    // Evaluate result
    t.deepEqual(output.split('\n'), [
        `import { Tralalero, Tralala } from './brainrots/index.js';`,
        `import ñeee from 'sparkle/laugh.ts';`,
        `import reee from '#root/reee.js';`,
    ]);
});