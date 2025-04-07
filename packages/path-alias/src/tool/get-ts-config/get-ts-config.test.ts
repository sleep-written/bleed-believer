import { getTsConfigMock } from './get-ts-config.mock.js';

import {
    TsconfigFileNotFoundError,
    InvalidTsconfigFileError,
    InvalidStatsTypeError,
    ResponseStatusError,
    JSONParseError,
    FetchError,
} from './errors/index.js';

getTsConfigMock(
    null,
    '/tralalero/tralala/tsconfig.json',
    {
        cwd: '/tralalero/tralala',
        files: [
            '/tralalero/tralala/tsconfig.json'
        ],
        folders: [
            '/tralalero/tralala',
        ]
    }
);

getTsConfigMock(
    null,
    '/tralalero/tsconfig.json',
    {
        cwd: '/tralalero/tralala',
        files: [
            '/tralalero/tsconfig.json'
        ],
        folders: [
            '/tralalero/tralala',
        ]
    }
);

getTsConfigMock(
    null,
    TsconfigFileNotFoundError,
    {
        cwd: '/tralalero/tralala',
        folders: [
            '/tralalero/tralala',
        ]
    }
);

getTsConfigMock(
    'tsconfig.base.json',
    '/tralalero/tralala/tsconfig.json',
    {
        cwd: '/tralalero/tralala',
        files: [
            '/tralalero/tralala/tsconfig.json',
            '/tralalero/tralala/tsconfig.base.json'
        ],
        folders: [
            '/tralalero/tralala',
        ]
    }
);

getTsConfigMock(
    'bombardino.cocodrilo.rar',
    InvalidTsconfigFileError,
    {
        cwd: '/tralalero/tralala',
        files: [
            '/tralalero/tralala/tsconfig.json'
        ],
        folders: [
            '/tralalero/tralala',
        ],
        otherfiles: [
            '/tralalero/tralala/bombardino.cocodrilo.rar'
        ]
    }
);

getTsConfigMock(
    '../tsconfig.json',
    '/tung/tung/tsconfig.json',
    {
        cwd: '/tung/tung/sahur',
        files: [
            '/tung/tung/tsconfig.json'
        ],
        folders: [
            '/tung/tung/sahur',
        ]
    }
);

getTsConfigMock(
    'https://www.4chan.org/cp.json',
    `JSON.parse('https://www.4chan.org/cp.json')`,
    {
        cwd: '/tralalero/tralala',
        fetchjson: {
            compilerOptions: {
                target: 'ES2024',
                module: 'Node16'
            }
        }
    }
);

getTsConfigMock(
    'https://www.4chan.org/b/65132518',
    JSONParseError,
    {
        cwd: '/tralalero/tralala',
        fetchjson: 'puré, puré con caca, tengo el surullo atravesao~'
    }
);

getTsConfigMock(
    'https://www.4chan.org/b/65132518',
    ResponseStatusError,
    {
        cwd: '/tralalero/tralala'
    }
);

getTsConfigMock(
    'https://www.4chan.org/b/66666666',
    FetchError,
    {
        cwd: '/tralalero/tralala',
        fetchjson: new Error('AjajJAJjajajJ')
    }
);

getTsConfigMock(
    '/@REEEEEEEEEEE',
    InvalidStatsTypeError,
    {
        cwd: '/tralalero/tralala',
        otherstats: [
            '/@REEEEEEEEEEE'
        ]
    }
);