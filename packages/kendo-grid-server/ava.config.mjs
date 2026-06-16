export default {
    files: [
        './src/**/*.test.ts',
        './src/**/*.test.mts',
    ],
    extensions: [ 'ts', 'mts' ],
    nodeArguments: [
        '--import=@bleed-believer/cli',
    ]
}