import { Command, Executable } from '@bleed-believer/commander';

import { commander } from '../index.js';
import chalk from 'chalk';

@Command({
    name: 'help',
    path: '...'
})
export class HelpCommand implements Executable {
    async start(): Promise<void> {
        const docs = commander
            .docs()
            .filter(x => x.name !== 'help')
            .map(x => [
                chalk.underline.blueBright(x.name),
                `path: ${chalk.greenBright(x.path.join(' '))}`,
                `info: ${x.info}`
            ])
            .map(x => x.join('\n'))
            .join('\n\n');

        console.log(chalk.underline.yellow('Documentation'));
        console.log('Available commands:\n');
        console.log(docs);
    }
}