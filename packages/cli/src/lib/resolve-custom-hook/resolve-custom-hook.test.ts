import type { ResolveCustomHookInject, DefaultResolve } from './interfaces/index.js';
import type { ResolveHookContext } from 'module';

import { ResolveCustomHook } from './resolve-custom-hook.js';
import { TSConfig } from '@lib/ts-config/index.js';

import { pathToFileURL } from 'url';
import test from 'ava';

const inject: ResolveCustomHookInject = {
    process: {
        cwd: () => '/path/to/project'
    },
    access: async path => {
        switch (path) {
            case '/path/to/project/src/tool/daemon/index.ts':
            case '/path/to/project/dist/tool/daemon/index.js': {
                return;
            }

            default: {
                throw new Error(`File isn\'t accesible`);
            }
        }
    }
};

const defaultResolve: DefaultResolve = (specifier) => {
    switch (specifier) {
        case 'crypto': {
            return {
                url: `node:${specifier}`,
                format: 'builtin-module'
            };
        }

        case '/path/to/project/dist/tool/daemon/index.js':
        case '/path/to/project/src/tool/daemon/index.ts': {
            return {
                url: specifier
            }
        }

        default: {
            throw new Error('Cannot resolve url');
        }
    }
};

const tsConfig = new TSConfig({
    compilerOptions: {
        outDir: 'dist',
        baseUrl: 'src',
        rootDir: 'src',

        paths: {
            '@tool/*': [ 'tool/*' ]
        }
    }
});

test('"crypto" → "crypto" (builtin)', async t => {
    const context: ResolveHookContext = {
        parentURL: pathToFileURL('/path/to/project/src/tool/satan/satan.ts').href,
        conditions: [],
        importAttributes: {}
    };

    const matcher = new ResolveCustomHook(tsConfig, inject);
    const result = await matcher.resolve('crypto', context, defaultResolve);
    t.is(result.url, 'node:crypto');
});

test('"@tool/daemon/index.js" → "/path/to/project/src/tool/daemon/index.ts"', async t => {
    const context: ResolveHookContext = {
        parentURL: pathToFileURL('/path/to/project/src/tool/satan/satan.ts').href,
        conditions: [],
        importAttributes: {}
    };

    const matcher = new ResolveCustomHook(tsConfig, inject);
    const result = await matcher.resolve('@tool/daemon/index.js', context, defaultResolve);
    t.is(result.url, '/path/to/project/src/tool/daemon/index.ts');
});

test('"@tool/demigod/index.js" → "/path/to/project/src/tool/daemon/index.ts" (not found)', async t => {
    const context: ResolveHookContext = {
        parentURL: pathToFileURL('/path/to/project/src/tool/satan/satan.ts').href,
        conditions: [],
        importAttributes: {}
    };

    const matcher = new ResolveCustomHook(tsConfig, inject);
    await t.throwsAsync(
        () => matcher.resolve('@tool/demigod/index.js', context, defaultResolve),
        { message: `Cannot resolve url` }
    );
});

test('"@tool/daemon/index.js" → "/path/to/project/dist/tool/daemon/index.js"', async t => {
    const context: ResolveHookContext = {
        parentURL: pathToFileURL('/path/to/project/dist/tool/satan/satan.js').href,
        conditions: [],
        importAttributes: {}
    };

    const matcher = new ResolveCustomHook(tsConfig, inject);
    const result = await matcher.resolve('@tool/daemon/index.js', context, defaultResolve);
    t.is(result.url, '/path/to/project/dist/tool/daemon/index.js');
});

test('"@tool/demigod/index.js" → "/path/to/project/dist/tool/daemon/index.js" (not found)', async t => {
    const context: ResolveHookContext = {
        parentURL: pathToFileURL('/path/to/project/dist/tool/satan/satan.js').href,
        conditions: [],
        importAttributes: {}
    };

    const matcher = new ResolveCustomHook(tsConfig, inject);
    await t.throwsAsync(
        () => matcher.resolve('@tool/demigod/index.js', context, defaultResolve),
        { message: `Cannot resolve url` }
    );
});