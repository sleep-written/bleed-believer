import type { TSConfigObject, FileTranspilerInject } from './interfaces/index.js';
import type { Config, Options, Output } from '@swc/core';
import type { TsConfigValue } from '@lib/ts-config/index.js';

import { basename, dirname, isAbsolute, resolve, sep } from 'path';
import { FileTranspiler } from './file-transpiler.js';
import test from 'ava';

interface FileSystem {
    [K: string]: FileSystem | string;
}

class TSConfig implements TSConfigObject {
    value: TsConfigValue;

    constructor(value: TsConfigValue) {
        this.value = value;
    }

    toSWC = (): Config => ({
        sourceMaps: !!this.value.compilerOptions?.sourceMap
    });
}

class Inject implements FileTranspilerInject {
    filesystem: FileSystem;

    process = { cwd: () => '/path/to/project' };

    constructor(filesystem: FileSystem) {
        this.filesystem = filesystem;
    }

    mkdir(path: string, _: { recursive: true; }): Promise<undefined> {
        if (!isAbsolute(path)) {
            path = resolve(this.process.cwd(), path);
        }

        let fs = this.filesystem;
        for (const part of path.split(sep).slice(1)) {
            if (!fs[part]) {
                fs[part] = {};
                fs = fs[part];
            }

            if (typeof fs[part] !== 'string') {
                fs = fs[part];
            }
        }

        return Promise.resolve(undefined);
    }

    async readFile(path: string, _: 'utf-8'): Promise<string> {
        if (!isAbsolute(path)) {
            path = resolve(this.process.cwd(), path);
        }

        let fs = this.filesystem;
        for (const part of dirname(path).split(sep).slice(1)) {
            if (!fs[part]) {
                throw new Error(`The file "${path}" doesn't exists`);
            }

            if (typeof fs[part] !== 'string') {
                fs = fs[part];
            }
        }

        const code = fs[basename(path)];
        if (typeof code !== 'string') {
            throw new Error(`The file "${path}" doesn't exists`);
        }

        return code;
    }

    async writeFile(path: string, data: Buffer): Promise<void>;
    async writeFile(path: string, data: string, encoding: 'utf-8'): Promise<void>;
    async writeFile(path: string, data: string | Buffer, _?: unknown): Promise<void> {
        if (!isAbsolute(path)) {
            path = resolve(this.process.cwd(), path);
        }

        if (Buffer.isBuffer(data)) {
            data = data.toString('utf-8');
        }

        let fs = this.filesystem;
        for (const part of dirname(path).split(sep).slice(1)) {
            if (!fs[part]) {
                throw new Error(`The file "${path}" doesn't exists`);
            }

            if (typeof fs[part] !== 'string') {
                fs = fs[part];
            }
        }

        fs[basename(path)] = data;
    }

    async transform(source: string, options?: Options): Promise<Output> {
        const output: Output = {
            code: `// transpiled\n${source}`
        };

        switch (options?.sourceMaps) {
            case true: {
                output.map = '// sourcemap';
                break;
            };

            case 'inline': {
                output.code += '\n// sourcemap';
                break;
            }
        }

        return output;
    }
}

test('Transpile file', async t => {
    const inject = new Inject({
        path: {
            to: {
                project: {
                    src: {
                        'foo.ts': `console.log("foo.ts");`,
                        lib: {
                            'bar.ts': `console.log("bar.ts");`,
                            'baz.ts': `console.log("baz.ts");`,
                        }
                    }
                }
            }
        }
    });

    const tsConfig = new TSConfig({
        compilerOptions: {
            outDir: 'dist',
            rootDir: 'src'
        }
    });

    const transpiler = new FileTranspiler(tsConfig, inject);
    await transpiler.transpile('/path/to/project/src/foo.ts');
    await transpiler.transpile('/path/to/project/src/lib/bar.ts');
    await transpiler.transpile('/path/to/project/src/lib/baz.ts');

    t.deepEqual(inject.filesystem, {
        path: {
            to: {
                project: {
                    dist: {
                        'foo.js': `// transpiled\nconsole.log("foo.ts");`,
                        lib: {
                            'bar.js': `// transpiled\nconsole.log("bar.ts");`,
                            'baz.js': `// transpiled\nconsole.log("baz.ts");`,
                        }
                    },
                    src: {
                        'foo.ts': `console.log("foo.ts");`,
                        lib: {
                            'bar.ts': `console.log("bar.ts");`,
                            'baz.ts': `console.log("baz.ts");`,
                        }
                    }
                }
            }
        }
    });
});