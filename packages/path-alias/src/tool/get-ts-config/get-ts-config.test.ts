import test from 'ava';

import { getTsConfigFilesystemMock } from './get-ts-config.filesystem.mock.js';
import { getTsConfigFetchMock } from './get-ts-config.fetch.mock.js';
import { getTsConfig } from './get-ts-config.js';

import {
    TsconfigFileNotFoundError,
    InvalidTsconfigFileError,
    StatsError,
    JSONParseError,
    ResponseStatusError,
} from './errors/index.js';

test('get: null (default); cwd: "/tralalero/tralala"; target: "/tralalero/tralala/tsconfig.json"; → file found', async t => {
    // Given
    const injection = getTsConfigFilesystemMock({
        cwd: '/tralalero/tralala',
        folders: [ '/tralalero/tralala' ],
        target: {
            path: '/tralalero/tralala/tsconfig.json',
            config: {
                compilerOptions: {
                    target: 'ES2024',
                    module: 'Node16'
                }
            }
        }
    });

    // When
    const result = await getTsConfig(null, injection);

    // Then
    t.is(result.path, '/tralalero/tralala/tsconfig.json');
    t.is(result.config?.compilerOptions?.target, 'ES2024');
    t.is(result.config?.compilerOptions?.module, 'Node16');
});

test('get: null (default); cwd: "/tralalero/tralala"; target: "/tralalero/tsconfig.json"; → file found', async t => {
    // Given
    const injection = getTsConfigFilesystemMock({
        cwd: '/tralalero/tralala',
        folders: [ '/tralalero/tralala' ],
        target: {
            path: '/tralalero/tsconfig.json',
            config: {
                compilerOptions: {
                    target: 'ES2024',
                    module: 'Node16'
                }
            }
        }
    });

    // When
    const result = await getTsConfig(null, injection);

    // Then
    t.is(result.path, '/tralalero/tsconfig.json');
    t.is(result.config?.compilerOptions?.target, 'ES2024');
    t.is(result.config?.compilerOptions?.module, 'Node16');
});

test('get: null (default); cwd: "/tralalero/tralala"; target: null; → file not found', async t => {
    // Given
    const injection = getTsConfigFilesystemMock({
        cwd: '/tralalero/tralala',
        folders: [ '/tralalero/tralala' ],
    });

    await t.throwsAsync(
        // When
        () => getTsConfig(null, injection),

        // Then
        { instanceOf: TsconfigFileNotFoundError }
    );
});

test('get: null (default); cwd: "/tralalero/tralala"; target: /tralalero/tralala/tsconfig.json; → invalid file', async t => {
    // Given
    const injection = getTsConfigFilesystemMock({
        cwd: '/tralalero/tralala',
        files: [ '/tralalero/tralala/tsconfig.json' ],
        folders: [ '/tralalero/tralala' ],
    });

    await t.throwsAsync(
        // When
        () => getTsConfig(null, injection),

        // Then
        { instanceOf: InvalidTsconfigFileError }
    );
});

test('get: tsconfig.base.json; cwd: "/tralalero/tralala"; target: "/tralalero/tralala/tsconfig.base.json"; → file found', async t => {
    // Given
    const injection = getTsConfigFilesystemMock({
        cwd: '/tralalero/tralala',
        folders: [ '/tralalero/tralala' ],
        target: {
            path: '/tralalero/tralala/tsconfig.base.json',
            config: {
                compilerOptions: {
                    target: 'ES2024',
                    module: 'Node16'
                }
            }
        }
    });

    // When
    const result = await getTsConfig('tsconfig.base.json', injection);

    // Then
    t.is(result.path, '/tralalero/tralala/tsconfig.base.json');
    t.is(result.config?.compilerOptions?.target, 'ES2024');
    t.is(result.config?.compilerOptions?.module, 'Node16');
});

test('get: tsconfig.base.json; cwd: "/tralalero/tralala"; target: null; → file not found', async t => {
    // Given
    const injection = getTsConfigFilesystemMock({
        cwd: '/tralalero/tralala',
        folders: [ '/tralalero/tralala' ]
    });

    await t.throwsAsync(
        // When
        () => getTsConfig('tsconfig.base.json', injection),

        // Then
        { instanceOf: StatsError }
    )
});

test.only('get: "https://www.4chan.org/cp.json"; cwd: "/bombardino/cocodrilo"; → valid JSON', async t => {
    // Given
    const injection = getTsConfigFetchMock({
        cwd: '/bombardino/cocodrilo',
        url: 'https://www.4chan.org/cp.json',
        status: 200,
        response: {
            compilerOptions: {
                target: 'ES2024',
                module: 'Node16'
            }
        }
    });

    // When
    const result = await getTsConfig('https://www.4chan.org/cp.json', injection);

    // Then
    t.is(result.path, '/bombardino/cocodrilo/cp.json');
    t.is(result.config?.compilerOptions?.target, 'ES2024');
    t.is(result.config?.compilerOptions?.module, 'Node16');
});

test.only('get: "https://www.4chan.org/fbi"; cwd: "/bombardino/cocodrilo"; → invalid http response', async t => {
    // Given
    const injection = getTsConfigFetchMock({
        cwd: '/bombardino/cocodrilo',
        url: 'https://www.4chan.org/fbi',
        status: 404,
        response: `Página no encontrada`
    });

    await t.throwsAsync(
        // When
        () => getTsConfig('https://www.4chan.org/fbi', injection),

        // Then
        { instanceOf: ResponseStatusError }
    )
});

test.only('get: "https://www.4chan.org/cp.rar"; cwd: "/bombardino/cocodrilo"; → invalid JSON', async t => {
    // Given
    const injection = getTsConfigFetchMock({
        cwd: '/bombardino/cocodrilo',
        url: 'https://www.4chan.org/cp.rar',
        status: 200,
        response: `351356546545asdfa65sd656546 6a5s4df65asdf65a sa6df4$$$$zxf5464a6g`
    });

    await t.throwsAsync(
        // When
        () => getTsConfig('https://www.4chan.org/cp.rar', injection),

        // Then
        { instanceOf: JSONParseError }
    )
});