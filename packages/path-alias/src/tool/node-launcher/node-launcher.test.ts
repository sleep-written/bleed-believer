import { buildTest } from './build-test.fake.js';

buildTest(false, './src/index.ts');
buildTest(true, './src/index.ts');

buildTest(false, './src/index.ts', 'aaa', 'zzz');
buildTest(true, './src/index.ts', 'aaa', 'zzz');

buildTest(false, './dist/index.js');
buildTest(true, './dist/index.js');

buildTest(false, './dist/index.js', 'aaa', 'zzz');
buildTest(true, './dist/index.js', 'aaa', 'zzz');