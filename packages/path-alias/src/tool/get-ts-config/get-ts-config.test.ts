import test from 'ava';

import { getTsConfigFilesystemMock } from './get-ts-config.filesystem.mock.js';
import { getTsConfig } from './get-ts-config.js';

import {
    TsconfigFileNotFoundError,
    InvalidTsconfigFileError,
    InvalidStatsTypeError,
    StatsError,
} from './errors/index.js';

test('get: null (default); cwd: "/tralalero/tralala"; target: "/tralalero/tralala/tsconfig.json"; → file found', t => {
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
    const result = getTsConfig(null, injection);

    // Then
    t.is(result.path, '/tralalero/tralala/tsconfig.json');
    t.is(result.config?.compilerOptions?.target, 'ES2024');
    t.is(result.config?.compilerOptions?.module, 'Node16');
});

test('get: null (default); cwd: "/tralalero/tralala"; target: "/tralalero/tsconfig.json"; → file found', t => {
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
    const result = getTsConfig(null, injection);

    // Then
    t.is(result.path, '/tralalero/tsconfig.json');
    t.is(result.config?.compilerOptions?.target, 'ES2024');
    t.is(result.config?.compilerOptions?.module, 'Node16');
});

test('get: null (default); cwd: "/tralalero/tralala"; target: null; → file not found', t => {
    // Given
    const injection = getTsConfigFilesystemMock({
        cwd: '/tralalero/tralala',
        folders: [ '/tralalero/tralala' ],
    });

    t.throws(
        // When
        () => getTsConfig(null, injection),

        // Then
        { instanceOf: TsconfigFileNotFoundError }
    );
});

test('get: null (default); cwd: "/tralalero/tralala"; target: /tralalero/tralala/tsconfig.json; → invalid file', t => {
    // Given
    const injection = getTsConfigFilesystemMock({
        cwd: '/tralalero/tralala',
        files: [ '/tralalero/tralala/tsconfig.json' ],
        folders: [ '/tralalero/tralala' ],
    });

    t.throws(
        // When
        () => getTsConfig(null, injection),

        // Then
        { instanceOf: InvalidTsconfigFileError }
    );
});

test('get: "tsconfig.base.json"; cwd: "/tralalero/tralala"; target: "/tralalero/tralala/tsconfig.base.json"; → file found', t => {
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
    const result = getTsConfig('tsconfig.base.json', injection);

    // Then
    t.is(result.path, '/tralalero/tralala/tsconfig.base.json');
    t.is(result.config?.compilerOptions?.target, 'ES2024');
    t.is(result.config?.compilerOptions?.module, 'Node16');
});

test('get: "/tralalero/tralala/tsconfig.base.json"; cwd: "/tralalero/tralala"; target: "/tralalero/tralala/tsconfig.base.json"; → file found', t => {
    // Given
    const injection = getTsConfigFilesystemMock({
        cwd: '/tralalero/tralala',
        folders: [ '/tralalero/tralala' ],
        target: {
            path: '/bombardino/cocodrilo/tsconfig.base.json',
            config: {
                compilerOptions: {
                    target: 'ES2024',
                    module: 'Node16'
                }
            }
        }
    });

    // When
    const result = getTsConfig('/bombardino/cocodrilo/tsconfig.base.json', injection);

    // Then
    t.is(result.path, '/bombardino/cocodrilo/tsconfig.base.json');
    t.is(result.config?.compilerOptions?.target, 'ES2024');
    t.is(result.config?.compilerOptions?.module, 'Node16');
});

test('get: "/@perreo/ijoeputa/tsconfig.json"; cwd: "/tralalero/tralala"; target: null; → unsupported stats (symlink)', t => {
    // Given
    const injection = getTsConfigFilesystemMock({
        cwd: '/tralalero/tralala',
        folders: [ '/tralalero/tralala' ],
        symlinks: [ '/@perreo/ijoeputa' ]
    });

    t.throws(
        // When
        () => getTsConfig('/@perreo/ijoeputa/tsconfig.json', injection),

        // Then
        { instanceOf: InvalidStatsTypeError }
    );
});

test('get: tsconfig.base.json; cwd: "/tralalero/tralala"; target: null; → file not found', t => {
    // Given
    const injection = getTsConfigFilesystemMock({
        cwd: '/tralalero/tralala',
        folders: [ '/tralalero/tralala' ]
    });

    t.throws(
        // When
        () => getTsConfig('tsconfig.base.json', injection),

        // Then
        { instanceOf: StatsError }
    )
});
