import type { TsConfigValue } from '@lib/ts-config/index.js';
import type { Config } from '@swc/core';

export interface TSConfigObject {
    toSWC(): Config;
    value: TsConfigValue;
}