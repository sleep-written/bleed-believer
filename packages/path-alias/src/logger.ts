import { Logger } from 'tslog';

export const logger = new Logger({
    name: '@bleed-believer/path-alias',
    prettyLogTemplate: 
            `{{name}} -> {{logLevelName}} `
        +   `[{{hh}}:{{MM}}:{{ss}}.{{ms}}]: `
});

export function separator(): void {
    console.log(''.padEnd(65, '-'));
}