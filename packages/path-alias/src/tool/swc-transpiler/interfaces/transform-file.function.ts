import type { Options } from '@swc/core';
import type { Output } from './output.js';

export type TransformFileFunction = (
    path: string,
    options?: Options
) => Promise<Output>;
