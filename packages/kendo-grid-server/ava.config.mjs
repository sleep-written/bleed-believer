export default {
    files: [
        './src/**/*.test.ts',
        './src/**/*.test.mts',
    ],
    extensions: {
        ts: 'module',
        mts: 'module',
    },
    nodeArguments: [
        '--no-warnings',
        '--loader=ts-node/esm',
    ]
};
