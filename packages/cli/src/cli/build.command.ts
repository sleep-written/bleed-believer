import type { CommandModule } from 'yargs';

import { Transpiler } from '@lib/transpiler/index.js';
import { TSConfig } from '@lib/ts-config/ts-config.js';

interface Argv {
    config?: string;
    watch?: boolean;
    '--'?: string[];
}

export const buildCommand: CommandModule<{}, Argv> = {
    command:    'build',
    describe:   'Transpile the whole project using SWC',
    builder:    yargs => yargs
        .options('config', {
            string: true,
            description: 'The custom "tsconfig.json" do you want to use'
        })
        .options('watch', {
            boolean: true,
            description: 'Activate "watch" mode'
        })
        .parserConfiguration({
            "populate--": true
        }),
    handler: async argv => {
        const tsConfig = await TSConfig.load(argv.config);
        const transpiler = new Transpiler(tsConfig);
        if (argv.watch) {
            await transpiler.watch();
        } else {
            await transpiler.build();
        }

        process.exit(0);
    }
}