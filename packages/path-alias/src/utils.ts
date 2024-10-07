import { join } from 'path';

import { ExtParser } from '@tool/ext-parser/index.js';
import { TsConfig } from '@tool/ts-config/index.js';
import { TsFlag } from '@tool/ts-flag/index.js';

let tsConfig: TsConfig;
let tsFlag: TsFlag;
export function isSourceCode(): boolean {
    if (!tsFlag) {
        tsFlag = new TsFlag(`${process.pid}`);
    }

    return tsFlag.isParsingSourceCode;
}

export function pathResolve(input: string, multi?: false): string;
export function pathResolve(input: string, multi: true): string[];
export function pathResolve(input: string, multi?: boolean): string | string[] {
    if (!tsConfig) {
        tsConfig = TsConfig.load();
    }

    const rootDir = join(process.cwd(), tsConfig.rootDir);
    const outDir = join(process.cwd(), tsConfig.outDir);
    const out = tsConfig
        .resolveAll(input)
        .map(x => {
            if (!isSourceCode()) {
                const especifier = new ExtParser(x).toJs();
                return especifier.replace(rootDir, outDir);
            } else {
                return x;
            }
        });

    if (out.length === 0) {
        const specifier = new ExtParser(input);
        const basePath = isSourceCode()
            ?   join(process.cwd(), tsConfig.rootDir, specifier.toTs())
            :   join(process.cwd(), tsConfig.outDir,  specifier.toJs());

        out.push(basePath);
    }

    if (!multi) {
        return out[0];
    } else {
        return out;
    }
}