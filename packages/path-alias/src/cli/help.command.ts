import type { CommandMeta } from './command.meta.js';
import type { Executable } from '@bleed-believer/commander';

import { CLIRouting } from './routing.js';
import { Command } from '@bleed-believer/commander';
import chalk from 'chalk';

@Command({
    name: 'Help command',
    path: 'help',
    info: `Show information about the available commands.`
})
export class HelpCommand implements Executable {
    #getPropertySymbol<T = any>(o: any, description: string): T {
        const symbol = Object
            .getOwnPropertySymbols(o)
            .find(x => x.description === description);

        if (!symbol) {
            throw new Error(`The symbol with description "${description}" is not found.`);
        } else {
            return o[symbol];
        }
    }

    #getCommandsMeta(): CommandMeta[] {
        const metaMain = this.#getPropertySymbol(CLIRouting,     '@bleed-believer/meta:meta-storage');
        const metaData = this.#getPropertySymbol(metaMain._data, '@bleed-believer/commander:command-route');
        
        const out: CommandMeta[] = [];
        for (const command of metaData.commands as any[]) {
            const metaCmdMain = this.#getPropertySymbol(command,            '@bleed-believer/meta:meta-storage');
            const metaCmdData = this.#getPropertySymbol(metaCmdMain._data,  '@bleed-believer/commander:command');
            out.push(metaCmdData);
        }

        return out;
    }

    #showCommandInfo(meta: CommandMeta): void {
        console.log(`→`, chalk.underline.bold(meta.name));
        console.log(` `, chalk.grey('Command:'), chalk.blueBright(meta.path.join(' ')));
        console.log(` `, chalk.grey('Details:'), meta.info);
        console.log();
    }

    async start(): Promise<void> {
        console.log('Available commands:\n');
        const commandsMeta = this.#getCommandsMeta();
        for (const meta of commandsMeta) {
            this.#showCommandInfo(meta);
        }
    }
}