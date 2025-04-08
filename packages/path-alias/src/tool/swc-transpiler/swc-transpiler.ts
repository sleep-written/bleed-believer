import type { GetSourceCodeFunction, GetTsConfigFunction, ProcessInstance, SWCTranspilerInjection } from './interfaces/index.js';

import { getTsConfig } from '@tool/get-ts-config/index.js';
import { SourceCode } from './source-code.js';

export class SWCTranspiler {
    #getSourceCode: GetSourceCodeFunction;
    #getTsConfig: GetTsConfigFunction;
    #process: ProcessInstance;
    #path?: string | null;

    constructor(path?: string | null, injection?: Partial<SWCTranspilerInjection>) {
        this.#getSourceCode = injection?.getSourceCode ?? SourceCode.getSourceCode;
        this.#getTsConfig = injection?.getTsConfig ?? getTsConfig;
        this.#process = injection?.process ?? process;
        this.#path = path;
    }

    async build() {
        const tsConfigResult = this.#getTsConfig(this.#path, {
            process: this.#process
        });

        const files = await this.#getSourceCode(tsConfigResult, {
            process: this.#process
        });

        for (const file of files) {
            await file.transpile();
        }
    }
}