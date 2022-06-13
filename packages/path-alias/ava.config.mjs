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
        // '--loader=esbuild-node-loader',
        '--loader=ts-node/esm',
    ]
};
