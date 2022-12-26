# @bleed-believer/path-alias

A package to bind paths alias, resolving the `source` directory when the app is launched with ts-node, or resolving the `out` directory when ts-node isn't used. Includes some utilities in case if you need to generate paths dinamically depending of the code that is  running. Now you can use this package with proyects transpiled by [swc](https://swc.rs) (see details [here](#about-swc)).

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

This package is heavely inspired in [this response](https://github.com/TypeStrong/ts-node/discussions/1450#discussioncomment-1806115), so I give my gratitude to the [charles-hallen](https://github.com/charles-allen) work. If you see that the [Loader API](https://nodejs.org/api/esm.html#loaders) has been changed and this package stopped working, create an GitHub Issue notifying of the problem.

This package is designed to work in end-user backend aplications (because of how [module alias works](https://github.com/ilearnio/module-alias/blob/dev/README.md#using-within-another-npm-package)). So this probably doesn't work in front-end applications, or apps that uses a bundler (like webpack for example).

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

To explain all features of this package, we will use this project estructure as example:
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
│   ├── file-x.ts
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
            "@file-x": ["./file-x.ts"],
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
    --require ts-node/register \
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

## Unit testing with [ava](https://www.npmjs.com/package/ava)

Create in your folder where your package.json is located a file called `"ava.config.mjs"`. Assuming that your `"rootDir"` is `"./src"`, set that file like this:

### With __ESM__:
```js
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
        '--loader=@bleed-believer/path-alias/esm',
    ]
}
```

### With __CommonJS__:
```js
export default {
    files: [
        './src/**/*.test.ts',
        './src/**/*.test.cts',
    ],
    extensions: {
        ts: 'commonjs',
        cts: 'commonjs',
    },
    require: [
        'ts-node/register',
        '@bleed-believer/path-alias/cjs',
    ]
}
```

## Utilities

### Function `isTsNode`

If you want to check if `ts-node` is running, you can execute this function:
```ts
import { isTsNode } from '@bleed-believer/path-alias';

const response = isTsNode();  // Returns a boolean
console.log('if ts-node is running?', response); 
```

### Function `pathResolve`

Resolve any subfolder of `"rootDir"` depending if __ts-node__ is running. For example, imagine do you want to resolve the path `"./src/folder-a/*"`:

```ts
import { pathResolve } from '@bleed-believer/path-alias';

const path = pathResolve('./folder-a/*');
console.log('path:', path);
```

With __ts-node__ the output is:
```bash
node \
--loader @bleed-believer/path-alias/esm \
./src/index.ts

# path: src/folder-a/*
```

With the transpiled code:
```bash
node \
--loader @bleed-believer/path-alias/esm \
./dist/index.js

# path: dist/folder-a/*
```

## About SWC

In case you want to execute your project using ts-node, the command is the same:
```bash
node \
--loader @bleed-believer/path-alias/esm \
./src/index.ts
```
However if you need to executed your transpiled project by [swc](https://swc.rs), you don't need to use the loader, just call your root file:

```bash
node ./dist/index.js
```
The function `pathResolve` works perfectly with __swc__ using the example of above, so you don't need to use the loader in transpiled code to keep the `pathResolve` function working.

## Limitations

- The library requires a `"tsconfig.json"` file into the current working directory to work. Doesn't matter if that file extends another file, or be a part of a set of inhetirance, __while all required properties are accesible through its ancestors.__

- The resolve output between `"baseURL"` and the `"paths"` declared in the `"tsconfig.json"` file must always return a path inside of `"rootDir"` folder.

- __swc__ isn't compatible with alias like this: `"@data-source": ["./data-source.ts"]`.