import test from 'ava';
import { PathAlias } from './path-alias.js';

// Test to check if the entry point is correctly identified as being inside rootDir or not
test('Check rootDir recognition', t => {
    const pathAliasRoot = new PathAlias(
        {
            compilerOptions: {
                outDir: './dist',
                rootDir: './src',
            }
        },
        {
            cwd: '/path/to/project',
            entryPoint: '/path/to/project/src/index.ts'
        }
    );

    const pathAliasOut = new PathAlias(
        {
            compilerOptions: {
                outDir: './dist',
                rootDir: './src',
            }
        },
        {
            cwd: '/path/to/project',
            entryPoint: '/path/to/project/dist/index.js'
        }
    );

    t.true(pathAliasRoot.isInsideSrc('/path/to/project/src/index.ts'));
    t.false(pathAliasOut.isInsideSrc('/path/to/project/dist/index.js'));
});

// Test suite for path alias resolution
test('Check if path alias works', async t => {
    const pathAlias = new PathAlias(
        {
            compilerOptions: {
                outDir: './dist',
                rootDir: './src',
                baseUrl: './src',
                paths: {
                    '@entities/*': ['./entities/*'],
                    '@tool/*': ['./tool/*', './tool-legacy/*'],
                    '@file': ['./file.js']
                }
            }
        },
        {
            cwd: '/path/to/project',
            entryPoint: '/path/to/project/src/index.ts',
            isFileExists: path => {
                // Simulate the existence of certain files based on their paths
                if (path.includes('tool')) {
                    return Promise.resolve(
                        // 'break' exists in 'tool', 'parse' exists in 'tool-legacy'
                        (!path.includes('legacy') && path.includes('break')) ||
                        (path.includes('legacy') && path.includes('parse'))
                    );
                } else {
                    // All other paths are considered to exist
                    return Promise.resolve(true);
                }
            },
            isModuleInstalled: path => {
                return [
                    'discord.js',
                    'tslog'
                ].some(x => x === path);
            }
        }
    );

    // Test resolving an entity path
    t.is(
        await pathAlias.resolveSpecifier('@entities/user.entity.js'),
        '/path/to/project/src/entities/user.entity.ts'
    );

    // Test resolving a tool path that exists in the primary mapping
    t.is(
        await pathAlias.resolveSpecifier('@tool/break/index.js'),
        '/path/to/project/src/tool/break/index.ts'
    );

    // Test resolving a tool path that exists in the secondary mapping
    t.is(
        await pathAlias.resolveSpecifier('@tool/parse/index.js'),
        '/path/to/project/src/tool-legacy/parse/index.ts'
    );

    // Test resolving a direct file alias
    t.is(
        await pathAlias.resolveSpecifier('@file'),
        '/path/to/project/src/file.ts'
    );

    // Test resolving an alias without a corresponding path mapping
    t.is(
        await pathAlias.resolveSpecifier('@tool'),
        '@tool'
    );

    // Test resolving external modules (should return as is)
    t.is(
        await pathAlias.resolveSpecifier('discord.js'),
        'discord.js'
    );

    t.is(
        await pathAlias.resolveSpecifier('tslog'),
        'tslog'
    );

    // Test resolving an alias with special characters (should return as is)
    t.is(
        await pathAlias.resolveSpecifier('@ñeeee/file.js'),
        '@ñeeee/file.js'
    );
});

// Additional tests to cover more scenarios
test('Resolve without paths configured', async t => {
    const pathAlias = new PathAlias(
        {
            compilerOptions: {
                baseUrl: './src'
            }
        },
        {
            cwd: '/path/to/project',
            entryPoint: '/path/to/project/src/index.ts',
        }
    );

    // Should return the specifier as is since no paths are configured
    t.is(
        await pathAlias.resolveSpecifier('@entities/user.entity.js'),
        '@entities/user.entity.js'
    );
});

test('Resolve with multiple wildcard matches', async t => {
    const pathAlias = new PathAlias(
        {
            compilerOptions: {
                baseUrl: './src',
                paths: {
                    '@module/*/sub/*': ['./modules/*/sub-modules/*']
                }
            }
        },
        {
            cwd: '/path/to/project',
            entryPoint: '/path/to/project/src/index.ts',
            isFileExists: () => Promise.resolve(true),
        }
    );

    // Test resolving a path with multiple wildcards
    t.is(
        await pathAlias.resolveSpecifier('@module/foo/sub/bar.js'),
        '/path/to/project/src/modules/foo/sub-modules/bar.ts'
    );
});
