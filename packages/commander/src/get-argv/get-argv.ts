import { MetaManager } from '@bleed-believer/meta';

import type { GetArgvDecorator } from './get-argv.decorator.js';
import type { Argv } from '../argv-parser/index.js';

import { Commander, InstanceNotExecutedError } from '../commander/index.js';

export const GET_ARGV = new MetaManager<Argv>();

/**
 * Transforms a declared property into an `Argv` property getter.
 */
export function GetArgv(): GetArgvDecorator {
    return (target, key) => {
        Object.defineProperty(target, key, {
            get: () => {
                const meta = GET_ARGV.get(Commander, true);
                if (!meta) {
                    throw new InstanceNotExecutedError();
                } else {
                    return meta;
                }
            }
        });
    }
}
