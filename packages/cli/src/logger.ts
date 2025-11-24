import { Logger } from 'tslog';

export const logger = new Logger({
    name: '@bleed-believer',
    prettyLogTemplate:   `{{name}} - {{logLevelName}}\t→ `,
    prettyErrorTemplate: `{{errorMessage}}\n{{errorStack}}`
});