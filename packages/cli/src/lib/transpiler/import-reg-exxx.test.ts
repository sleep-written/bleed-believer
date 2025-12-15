import { ImportRegExxx } from './import-reg-exxx.js';
import test from 'ava';

test('Match "*.ts" imports', t => {
    const input = [
        `import brainrots from "./brainrots.js";`,
        `import "./brainrots.ts";`,
        `import brainrots from "./brainrots.ts";`,
        `import * as brainrots from "./brainrots.ts";`,
        `import { Tralalero } from "./brainrots.ts";`,
        `import { Tralalero, Tralala } from "./brainrots.ts";`,
        `import brainrots, { Tralalero, Tralala } from "./brainrots.ts";`,
        `export * from "./brainrots.ts";`,
        'export * as brainrots from "./brainrots.ts"',
        `export { Tralalero, Tralala } from "./brainrots.ts";`,
    ];

    const regExxx = new ImportRegExxx();
    const match = input
        .join('\n')
        .match(regExxx.toRegExp());

    t.deepEqual(match, [
        'import "./brainrots.ts"',
        'import brainrots from "./brainrots.ts"',
        'import * as brainrots from "./brainrots.ts"',
        'import { Tralalero } from "./brainrots.ts"',
        'import { Tralalero, Tralala } from "./brainrots.ts"',
        'import brainrots, { Tralalero, Tralala } from "./brainrots.ts"',
        'export * from "./brainrots.ts"',
        'export * as brainrots from "./brainrots.ts"',
        'export { Tralalero, Tralala } from "./brainrots.ts"',
    ]);
});