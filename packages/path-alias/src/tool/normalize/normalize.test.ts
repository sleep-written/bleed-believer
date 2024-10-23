import test from 'ava';
import { normalize } from './normalize.js';

test('Case 01', t => {
    interface Config {
        options?: {
            target?: 'ES2022' | 'ES2023' | 'System'
        }
    }

    const config: Config = {
        options: {
            target: 'es2023' as any
        }
    };

    const res = normalize(
        config.options?.target,
        [ 'ES2022', 'ES2023', 'System' ]
    );

    t.is(res, 'ES2023');
});
