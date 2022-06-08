import { MetaManager } from '@bleed-believer/meta';

import { GetArgvDataDecorator } from './get-argv-data.decorator.js';
import { Commander } from '../commander/index.js';
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
                    throw new Error('TODO: Create a class for this');
                } else {
                    return meta;
                }
            }
        });
    };
}
