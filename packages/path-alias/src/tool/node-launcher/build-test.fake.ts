import path from 'path';
import test from 'ava';

import { NodeLauncher } from './node-launcher.js';
import { ProcessFake } from './process.fake.js';
import { SpawnFake } from './spawn.fake.js';

export function buildTest(watch: boolean, targetPath: string, ...targetArgs: string[]): void {
    const textArgs = targetArgs
        .map(x => `"${x}"`)
        .join('", "');

    test(`target: "${targetPath}"; args: [ ${textArgs} ]; watch: ${watch}`, async t => {
        const spawnFake = new SpawnFake();
        const process = new ProcessFake();
    
        const launcher = new NodeLauncher(targetPath, targetArgs, {
            spawn: spawnFake.spawn.bind(spawnFake),
            process
        });
    
        await launcher.initialize(watch);


        const spawnArgsExpected: string[] = [ 'node' ];
        if (watch) {
            spawnArgsExpected.push('--watch');
        }
    
        spawnArgsExpected.push('--import', NodeLauncher.loaderPath);
        spawnArgsExpected.push(
            path.join(process.cwd(), targetPath),
            ...targetArgs
        );

        // console.log('espect:', spawnFake.spawnArgs);
        // console.log('actual:', spawnArgsExpected);
        t.deepEqual(spawnFake.spawnArgs, spawnArgsExpected);
    });
}