import { getTsConfigInjectionFake } from './get-ts-config.injection.fake.js';
import { getTsConfig } from './get-ts-config.js';
import test from 'ava';

export function getTsConfigMock(
    target: string | null,
    expect: string | {
        new (...o: any[]): Error;
    },
    options: Parameters<
        typeof getTsConfigInjectionFake
    >[0]
): void {
    let expectType: string;
    if (typeof expect === 'string') {
        expectType = expect;

    } else if (options.fetchjson && !(options.fetchjson instanceof Error)) {
        expectType = `JSON.parse('${target}')`;
        
    } else {
        expectType = expect.name;

    }

    test(`target: "${target}"; cwd "${options.cwd}"; expects "${expectType}"`, async t => {
        const injection = getTsConfigInjectionFake(options);
        if (typeof expect === 'string') {
            const result = await getTsConfig(target, injection);
            if (options.fetchjson) {
                t.is(typeof result.path,    'string');
                t.deepEqual(result.config,  options.fetchjson);

            } else {
                t.is(typeof result.path,    'string');
                t.is(typeof result.config,  'object');

            }
            
        } else {
            await t.throwsAsync(
                () => getTsConfig(target, injection),
                { instanceOf: expect }
            );
            
        }
    });
}