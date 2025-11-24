import type { DefaultLoad, LoadCustomHookInject } from './interfaces/index.js';
import type { LoadFnOutput, LoadHookContext } from 'module';

import { fileURLToPath, pathToFileURL } from 'url';
import { LoadCustomHook } from './load-custom-hook.js';
import { TSConfig } from '@lib/ts-config/index.js';
import test from 'ava';

const inject: LoadCustomHookInject = {
    process: { cwd: () => '/path/to/project' },
    transform: sourceCode => {
        if (sourceCode.startsWith('js file → "')) {
            const code = sourceCode.replace(/^js(?= file → )/, 'ts');
            return Promise.resolve({ code });
        }
        
        throw new Error('Invalid file');
    }
};

const defaultLoad: DefaultLoad = (url) => {
    const path = fileURLToPath(url);
    switch (path) {
        case '/path/to/project/src/foo.ts':
        case '/path/to/project/src/bar.ts': {
            return {
                format: 'typescript-module',
                source: `js file → "${path}"`
            };
        }

        case '/path/to/project/config.json': {
            return {
                format: 'json',
                source: JSON.stringify({
                    id: 666,
                    value: 'hi'
                })
            }
        }

        default: {
            throw new Error('File not found!');
        }
    }
};

const tsConfig = new TSConfig({
    compilerOptions: {
        target: 'es2024',
        module: 'node20',
        moduleResolution: 'node16'
    }
});

test('Load "foo.ts"', async t => {
    const loadHook = new LoadCustomHook(tsConfig, inject);
    const context: LoadHookContext = {
        format: 'typescript-module',
        conditions: [],
        importAttributes: {}
    };

    const url = pathToFileURL('/path/to/project/src/foo.ts').href;
    const output = await loadHook.load(url, context, defaultLoad);
    t.deepEqual(output, {
        format: 'typescript-module',
        source: 'ts file → "/path/to/project/src/foo.ts"',
        shortCircuit: true,
    } as LoadFnOutput);
});

test('Load "bar.ts"', async t => {
    const loadHook = new LoadCustomHook(tsConfig, inject);
    const context: LoadHookContext = {
        format: 'typescript-module',
        conditions: [],
        importAttributes: {}
    };

    const url = pathToFileURL('/path/to/project/src/bar.ts').href;
    const output = await loadHook.load(url, context, defaultLoad);
    t.deepEqual(output, {
        format: 'typescript-module',
        source: 'ts file → "/path/to/project/src/bar.ts"',
        shortCircuit: true,
    } as LoadFnOutput);
});

test('Load "config.json"', async t => {
    const loadHook = new LoadCustomHook(tsConfig, inject);
    const context: LoadHookContext = {
        format: 'json',
        conditions: [],
        importAttributes: {}
    };

    const url = pathToFileURL('/path/to/project/config.json').href;
    const output = await loadHook.load(url, context, defaultLoad);
    t.deepEqual(output, {
        format: 'json',
        source: JSON.stringify({
            id: 666,
            value: 'hi'
        })
    } as LoadFnOutput);
});

test('Load invalid file', async t => {
    const loadHook = new LoadCustomHook(tsConfig, inject);
    const context: LoadHookContext = {
        format: 'json',
        conditions: [],
        importAttributes: {}
    };

    const url = pathToFileURL('/path/to/project/ick2.zod').href;
    await t.throwsAsync(
        () => loadHook.load(url, context, defaultLoad),
        { message: 'File not found!' }
    )
});