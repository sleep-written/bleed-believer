import { MetaManager } from '@bleed-believer/meta';

import type { CommandDecorator, CommandMeta, CommandOptions } from './interfaces/index.js';
import { InvalidPathError } from './errors/index.js';
import { ArgvParser } from '../argv-parser/index.js';

export const COMMAND = new MetaManager<CommandMeta>('@bleed-believer/commander:command');
/**
 * Transforms a class into a `Command` class. Requires implement the `Executable` interface.
 * @param options The options required to configure the class.
 */
export function Command(options: CommandOptions): CommandDecorator {
    return target => {
        const path = ArgvParser.parsePattern(options.path);
        const inva = path.some(x => !x.match(/^(\.{3}|(:[a-z])?[a-z0-9\-_]*[a-z0-9])$/gi));
        if (inva) {
            console.log(path);
            throw new InvalidPathError();
        }

        COMMAND.set(target, {
            info: options.info ?? 'None information provided.',
            name: options.name,
            path,
        });
    };
}
