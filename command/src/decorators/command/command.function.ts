import { ClassMeta } from '@bleed-believer/core';

import { CommandMethodMeta } from '../command-method/command-method.meta';
import { CommandOptions } from './command.options';
import { CommandType } from './command.type';

export function Command(options: CommandOptions): (obj: CommandType) => void {
    let main: string[] = [];
    if (typeof options.main === 'string') {
        // Lowercase all and converts to string[] 
        const val = options.main.trim().toLowerCase();
        if (val) {
            main = val.split(/\s+/gi);
        } else {
            main = [];
        }
        
    } else if (options.main instanceof Array) {
        // lowercase all items
        main = options.main
            .map(x => x?.trim()?.toLowerCase())
            .filter(x => !!x);

    } else {
        // Add an empty array
        main = [];

    }

    let description = 'None description provided yet.';
    if (options.description) {
        description = options.description;
    }
    
    return obj => {
        if (!obj.__meta__) {
            // New Metadata
            obj.__meta__ = {
                main,
                title: options.title,
                methods: {},
                description
            };
        } else {
            // Add to existing metadata
            obj.__meta__.main = main,
            obj.__meta__.title = options.title,
            obj.__meta__.description = description;
        }

        // Check Methods
        const proto = obj?.prototype as ClassMeta<CommandMethodMeta>;
        if (proto?.__meta__?.methods) {
            obj.__meta__.methods = { ...proto.__meta__.methods };

            // Clean Metadata
            if (Object.keys(proto).length > 1) {
                delete proto.__meta__.methods;
            } else {
                delete proto.__meta__;
            }
        }
    };
}
