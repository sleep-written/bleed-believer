import { MetaManager } from '@bleed-believer/meta';

import { Commander, InstanceNotExecutedError } from '../commander/index.js';
import { GetArgvDataDecorator } from './get-argv-data.decorator.js';
import { ArgvData } from '../argv-parser/index.js';

export const GET_ARGV_DATA = new MetaManager<ArgvData>();

/**
 * Transforms a declared property into an `ArgvData` property getter.
 */
export function getArgvData(): GetArgvDataDecorator {
    return (target, key) => {
        Object.defineProperty(target, key, {
            get: () => {
                const meta = GET_ARGV_DATA.get(Commander, false);
                if (!meta) {
                    throw new InstanceNotExecutedError();
                } else {
                    return meta;
                }
            }
        });
    };
}
