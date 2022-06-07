import { MetaManager } from '@bleed-believer/meta';

import { GetArgvDecorator } from './get-argv.decorator.js';
import { Commander } from '../commander/index.js';
import { Argv } from '../argv-parser/index.js';

export const GET_ARGV = new MetaManager<Argv>();
export function GetArgv(): GetArgvDecorator {
    return (target, key) => {
        Object.defineProperty(target, key, {
            get: () => {
                const meta = GET_ARGV.get(Commander, true);
                if (!meta) {
                    throw new Error('TODO: Create a class for this');
                } else {
                    return meta;
                }
            }
        });
    }
}
