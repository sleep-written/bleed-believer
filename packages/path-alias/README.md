# @bleed-believer/path-alias

A package to bind paths alias, resolving the `source` directory when the app is launched with ts-node, or resolving the `out` directory when ts-node isn't used. Includes some utilities in case if you need to generate paths dinamically depending of the code that is  running.

This package has been designed to work with CommonJS projects (using [--require](https://nodejs.org/api/cli.html#-r---require-module) flag), and ESM projects (using [--loader](https://nodejs.org/api/esm.html#loaders) flag). This package is a new version of [ts-path-mapping](https://www.npmjs.com/package/ts-path-mapping), which _now will be deprecated._

With this package, you can forget about those ugly imports like:
```ts
import { Jajaja } from '../../../../../../../jajaja.js';
import { Gegege } from '../../../../../gegege.js';
```

...and instead you can use alias like this (with the power of intellisense):
```ts
import { Jajaja } from '@alias-a/jajaja.js';
import { Gegege } from '@alias-b/gegege.js';
```

## Disclaimer

This package is heavely inspired in [this response](https://github.com/TypeStrong/ts-node/discussions/1450), so I give my gratitude to the [charles-hallen](https://github.com/charles-allen) work. If you see that the [Loader API](https://nodejs.org/api/esm.html#loaders) has been changed and this package stopped working, create an GitHub Issue notifying of the problem.

This package is designed to work in end-user backend aplications (because of how [module alias works](https://github.com/ilearnio/module-alias/blob/dev/README.md#using-within-another-npm-package)). So this probably doesn't work in front-end applications, or apps that uses a bundler (like webpack of example).

Also, this package is __experimental__ and probably can generate unexpected behaviors, or performance issues. For that reason, <u>__you must test intensively this package in all possible use cases if do you want to implement in production.__</u>

## Installation

If you don't have installed ts-node, now is the moment:
```bash
npm i --save-dev ts-node
```

...and install this package as a dependency:
```bash
npm i --save @bleed-believer/path-alias
```

## Usage

First as example, we will use this project folder structure:
```bash
# Your current working directory
project-folder
│   # The project dependencies
├── node_modules
│
│   # The transpiled files
├── dist
│   │   # The file when the app starts
│   ├── index.js
│   │   
│   ├── folder-a
│   │   ├── ...
│   │   └── ...
│   ├── folder-b
│   │   ├── ...
│   │   └── ...
│   └── ...
│
│   # The source code
├── src
│   │   # The file when the app starts
│   ├── index.ts
│   │   
│   ├── folder-a
│   │   ├── ...
│   │   └── ...
│   ├── folder-b
│   │   ├── ...
│   │   └── ...
│   └── ...
│
│   # The project configuration files
├── package.json
├── package-lock.json
└── tsconfig.json
```

### Configure your `tsconfig.json`

This package reads the `tsconfig.json` file (and is capable to find values if the file extends another configuration files) to declare the alias. A typical configuration coul be similar to this:

```json
{
    "compilerOptions": {
        "rootDir": "./src",
        "outDir": "./dist",

        "baseUrl": "./src",
        "paths": {
            "@alias-a/*": ["./folder-a/*"],
            "@alias-b/*": ["./folder-b/*"],
        }
    }
}
```

The fields listed in the example of above are all required in order to the correct working of the package.

### ...with __ESM__ projects

- Execute the source code with __ts-node:__
    ```bash
    node \
    --loader ts-node/esm
    --loader @bleed-believer/path-alias/esm \
    ./src/index.ts
    ```

- Execute the transpiled code:
    ```bash
    node \
    --loader @bleed-believer/path-alias/esm \
    ./dist/index.js
    ```


### ...with __CommonJS__ projects

- Execute the source code with __ts-node:__
    ```bash
    node \
    --require ts-node/register
    --require @bleed-believer/path-alias/cjs \
    ./src/index.ts
    ```

- Execute the transpiled code:
    ```bash
    node \
    --loader @bleed-believer/path-alias/cjs \
    ./dist/index.js
    ```

- Also as alternative (only with commonjs), you can put at the top of your entry file this line:
    ```ts
    import '@bleed-believer/path-alias/cjs';
    import { Jajaja } from 'jajaja';
    import { Gegege } from 'gegege';

    // Bla bla bla
    // Bla bla bla
    ```
    ...and to execute, simply with ts:
    ```bash
    npx ts-node ./src/index.ts
    ```
    ...or:
    ```bash
    node ./dist/index.js
    ```


