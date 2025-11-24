import type { Config, Output } from '@swc/core';

export interface LoadCustomHookInject {
    process?: { cwd(): string; };
    transform?: (
        sourceCode: string,
        swcConfig: Config
    ) => Promise<Output>;
}