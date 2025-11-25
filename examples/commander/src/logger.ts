import { Logger } from 'tslog';

export const logger = new Logger({
    prettyLogTemplate:   `> {{logLevelName}}\t→ `,
    prettyErrorTemplate: `{{errorMessage}}\n\n  Stack Trace:\n{{errorStack}}`
});