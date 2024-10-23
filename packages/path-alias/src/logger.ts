import { Logger } from 'tslog';

export const logger = new Logger({
    name: '@bleed-believer/path-alias',
    prettyLogTemplate: [
        '{{name}}',
        '[{{hh}}:{{MM}}:{{ss}}.{{ms}}]',
        '{{logLevelName}}\t: '
    ].join(' ')
});

export function separator(): void {
    console.log(''.padEnd(75, '-'));
}