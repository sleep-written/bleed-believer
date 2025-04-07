import type { NodeJsProcessInstance, SwcTranspilerInjection } from './interfaces/index.js';

import { tsConfigFinder } from '../get-ts-config/index.js';
import { SourceCodeFile } from './source-code-file.js';
import { TsConfig } from '@tool/ts-config/index.js';

import fastGlob from 'fast-glob';
import path from 'path';

export class SwcTranspiler {
    #process: NodeJsProcessInstance;
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

    async build() {
        const rootDir = path.resolve(this.#tsConfig.cwd, this.#tsConfig.rootDir);
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