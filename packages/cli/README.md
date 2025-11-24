# bleed-believer cli
A `ts-node` replacement with path alias resolution and SWC under the hood.

## Basic usage
-   Install the package:
    ```shell
    npm i --save-dev @bleed-believer/cli
    ```

-   Next, launch your application (having a `tsconfig.json` is optional):
    ```shell
    ## Using the shortest executable name:
    npx bleed start ./src/index.ts

    ## ...or if you want the full executable name:
    npx @bleed-believer/cli start ./src/index.ts
    ```

If you don't have a `tsconfig.json` file in cwd, the `@bleed-believer/cli` will run your application using this default configuration:
```json
{
    "exclude": [ "node_modules" ],
    "compilerOptions": {
        "target": "esnext",
        "module": "nodenext",
        "moduleResolution": "nodenext"
    }
}
```

## CLI Commands
-   `npx bleed start [target]`  
    Run a TypeScript file using the custom ESM loader.
    -   `[target]`: The file do you want to execute.
    -   `--watch` _(optional)_: Execute as watch mode.
    -   `--` _(optional)_: Pass arguments to the typescript file.

-   `npx bleed build`  
    Transpile all files to JavaScript (like `tsc`, but faster).
    -   `--watch` _(optional)_: Execute as watch mode.
    -   `--config` _(optional)_: Sets a custom tsconfig JSON file.

## Using custom loader
If you want to execute your file with node and `@bleed-believer/cli` as loader:
```shell
node --import @bleed-believer/cli ./src/index.ts
```

## Using with AVA
Create the file `ava.config.mjs` in the root folder, with this content:
```ts
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
        '--import=@bleed-believer/cli'
    ]
}
```