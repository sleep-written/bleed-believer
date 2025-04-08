import type { NodeJsProcessInstance, SwcTranspilerInjection } from './interfaces/index.js';

import { SourceCodeFile } from './source-code-file.js';
import { getTsConfig } from '@tool/get-ts-config/index.js';
import { TsConfig } from '@tool/ts-config/index.js';

import fastGlob from 'fast-glob';
import path from 'path';

export class SwcTranspiler {
    #process: NodeJsProcessInstance;
    #tsConfigPath: string;

    constructor(injection?: Partial<SwcTranspilerInjection>) {
        this.#process = injection?.process ?? process;
        this.#tsConfigPath = injection?.tsConfigPath && !path.isAbsolute(injection.tsConfigPath)
        ?   path.join(this.#process.cwd(), injection.tsConfigPath)
        :   injection?.tsConfigPath ?? this.#process.cwd();
    }

    async build() {
        const tsConfig = new TsConfig(getTsConfig(this.#tsConfigPath));
        const rootDir = path.resolve(tsConfig.cwd, tsConfig.rootDir);
        let globPattern = path.join(rootDir, '**/*.{ts,mts}');
        if (process.platform === 'win32') {
            globPattern = globPattern.replaceAll('\\', '/');
        }

        const include = tsConfig?.config?.include?.map(x => {
            let out = path.join(tsConfig.cwd, x);
            if (process.platform === 'win32') {
                out = out.replaceAll('\\', '/');
            }
            return out;
        }) ?? [];

        const ignore = tsConfig?.config?.exclude?.map(x => {
            let out = path.join(tsConfig.cwd, x);
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
            cwd: tsConfig.path,
            ignore,
            absolute: true,
            globstar: true,
            onlyFiles: true,
            objectMode: true
        });

        if (files.length === 0) {
            throw new Error('None files detected to transpile to js.');
        }

        const swcConfig = tsConfig.toSwcConfig();
        delete swcConfig.exclude;

        for (const file of files) {
            const sourceCodeFile = new SourceCodeFile(file.path, tsConfig);
            await sourceCodeFile.transpile();
        }
    }
} 