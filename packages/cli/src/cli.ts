#! /usr/bin/env node
import { fileURLToPath } from 'url';
import { readFile } from 'fs/promises';
import { resolve } from 'path';
import chalk from 'chalk';
import yargs from 'yargs';

import { buildCommand } from '@cli/build.command.js';
import { startCommand } from '@cli/start.command.js';

await yargs(process.argv.slice(2))
    .detectLocale(false)
    .command(buildCommand)
    .command(startCommand)
    .command(
        '*',
        false,
        {},
        async () => {
            const path = resolve(fileURLToPath(import.meta.url), '../../banner.txt');
            const banner = await readFile(path, 'utf-8');

            console.log(chalk.greenBright(banner));
            console.log();
            console.log(chalk.bold(`>> Bleed Believer CLI`));
            console.log(`----------------------------------------------------------------`);
            console.log(chalk.yellow(`I left my soul again`));
            console.log(chalk.yellow(`Never want to try again`));
            console.log(chalk.yellow(`I left my soul and I`));
            console.log(chalk.yellow(`Never want to try again`));
            console.log(`----------------------------------------------------------------`);
            console.log(`Use "${chalk.blueBright("bleed help")}" to see all available commands`);
        }
    )
    .parse();