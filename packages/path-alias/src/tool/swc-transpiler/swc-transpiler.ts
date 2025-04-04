import type { NodeJsProcessInstance, SwcTranspilerInjection } from './interfaces/index.js';

import { tsConfigFinder } from './ts-config-finder.js';
import { ExtParser } from '@tool/ext-parser/index.js';
import { TsConfig } from '@tool/ts-config/index.js';

import { writeFile, mkdir } from 'fs/promises';
import { transformFile } from '@swc/core';
import fastGlob from 'fast-glob';
import path from 'path';
import { SourceCodeFile } from './source-code-file.js';

export class SwcTranspiler {
    #process: NodeJsProcessInstance;
    #mkDirCache = new Set<string>();
    #tsConfig: TsConfig;

    constructor(injection?: Partial<SwcTranspilerInjection>) {
        this.#process = injection?.process ?? process;
        if (typeof injection?.tsConfigPath === 'string') {
            const tsConfigPath = !path.isAbsolute(injection.tsConfigPath)
                ?   path.join(this.#process.cwd(), injection.tsConfigPath)
                :   injection.tsConfigPath;

            this.#tsConfig = new TsConfig(tsConfigFinder(tsConfigPath));

        } else {
            this.#tsConfig = new TsConfig(tsConfigFinder(this.#process.cwd()));

        }
    }

    async #mkDir(filepath: string): Promise<void> {
        const dir = path.dirname(filepath);
        if (!this.#mkDirCache.has(dir)) {
            await mkdir(dir, { recursive: true });
            this.#mkDirCache.add(dir);
        }
    }

    async build() {
        const rootDir = path.resolve(this.#tsConfig.cwd, this.#tsConfig.rootDir);
        const outDir = path.resolve(this.#tsConfig.cwd, this.#tsConfig.outDir);

        let globPattern = path.join(rootDir, '**/*.{ts,mts}');
        if (process.platform === 'win32') {
            globPattern = globPattern.replaceAll('\\', '/');
        }

        const include = this.#tsConfig?.config?.include?.map(x => {
            let out = path.join(this.#tsConfig.cwd, x);
            if (process.platform === 'win32') {
                out = out.replaceAll('\\', '/');
            }
            return out;
        }) ?? [];

        const ignore = this.#tsConfig?.config?.exclude?.map(x => {
            let out = path.join(this.#tsConfig.cwd, x);
            if (process.platform === 'win32') {
                out = out.replaceAll('\\', '/');
            }
            return out;
        });

        const files = await fastGlob([
            globPattern,
            ...include
        ], {
            dot: true,
            cwd: this.#tsConfig.path,
            ignore,
            absolute: true,
            globstar: true,
            onlyFiles: true,
            objectMode: true
        });

        if (files.length === 0) {
            throw new Error('None files detected to transpile to js.');
        }

        const swcConfig = this.#tsConfig.toSwcConfig();
        delete swcConfig.exclude;

        for (const file of files) {
            const sourceCodeFile = new SourceCodeFile(file.path, this.#tsConfig);
            await sourceCodeFile.transpile();
        }
    }
} 