import type { ImportTransformerInject } from './interfaces/index.js';
import type { TsConfigValue } from '@lib/ts-config/index.js';

import { resolve, sep } from 'path';
import { accessSync } from 'fs';

import { ImportRegExxx } from './import-reg-exxx.js';
import { PathAlias } from '@lib/path-alias/index.js';
import { TSConfig } from '@lib/ts-config/index.js';
import { RegExxx } from '@lib/reg-exxx/reg-exxx.js';

export class ImportTransformer {
    #pathAlias: PathAlias;
    #tsConfig: TSConfig;
    #srcPath: string;
    #regExxx: ImportRegExxx;
    #inject: Required<ImportTransformerInject>;

    constructor(tsConfigValue: TsConfigValue, inject?: ImportTransformerInject) {
        this.#tsConfig = new TSConfig(tsConfigValue, inject);
        this.#pathAlias = new PathAlias(this.#tsConfig, inject);
        this.#regExxx = new ImportRegExxx();
        this.#inject = {
            process:    inject?.process                 ?? process,
            access:     inject?.access?.bind(inject)    ?? accessSync
        };

        this.#srcPath = resolve(
            this.#inject.process.cwd(),
            tsConfigValue.compilerOptions?.rootDir ?? '.'
        ) + sep;
    }

    #exists(path: string): boolean {
        try {
            this.#inject.access(path);
            return true;
        } catch {
            return false;
        }
    }

    transform(source: string, sourcePath: string): string {
        const options = this.#tsConfig.value.compilerOptions;
        if (
            !options?.allowImportingTsExtensions &&
            !options?.rewriteRelativeImportExtensions
        ) {
            return source;
        }

        return source.replace(
            this.#regExxx.toRegExp(),
            m1 => {
                const regExxx = new RegExxx(
                    this.#regExxx.source,
                    this.#regExxx.flags.replace('g', '')
                ).toRegExp();

                const groups = regExxx.exec(m1)?.groups;
                if (!groups?.location) {
                    return m1;
                }

                const locations = this.#pathAlias.find(groups.location);
                for (const location of locations ?? [ resolve(sourcePath, '..', groups.location) ]) {
                    if (this.#exists(location) && location.startsWith(this.#srcPath)) {
                        return m1.replace(
                            /(?<=\.(m|c)?)t(?=sx?["'])/,
                            m2 => m2 === m2.toUpperCase()
                            ?   'J'
                            :   'j'
                        );
                    }
                }

                return m1;
            }
        );
    }
}