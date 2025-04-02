import { ArgvTestResource } from './argv.test-resource.js';

const testGenerator = new ArgvTestResource('/project/dir');

testGenerator.createTest(
    [ ],
    new Error('No command provided.')
);

testGenerator.createTest(
    [ 'start' ],
    new Error('No file target provided.')
);

testGenerator.createTest([ 'start', './src/index.ts' ], {
    command: 'start',
    targetPath: '/project/dir/src/index.ts',
    targetArgs: []
});

testGenerator.createTest([ 'start', './src/index.ts', 'aaa' ], {
    command: 'start',
    targetPath: '/project/dir/src/index.ts',
    targetArgs: [ 'aaa' ]
});

testGenerator.createTest([ 'start', './src/index.ts', 'aaa', 'zzz' ], {
    command: 'start',
    targetPath: '/project/dir/src/index.ts',
    targetArgs: [ 'aaa', 'zzz' ]
});