# @bleed-believer/path-alias
A package to bind paths alias, resolving the `source` directory when the app is launched with ts-node, or resolving the `out` directory when ts-node isn't used. Includes some utilities in case if you need to generate paths dinamically depending of the code that is  running. Now you can use this package with proyects transpiled by [swc](https://swc.rs) (see details [here](#about-swc)) and now has monorepo support (see [here](#about-monorepo-support) for details).

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

## About Node v20
The usage of `--loader` flag has changed since node v20. That means now from this version, every loader has been executed in isolated threads. Besides, the node's documentation now recommends to use the `--import` flag instead. That means made a lot of changes in the library source code to make this library works with the new flag.

That means the utility function `isTsNode` doesn't work for now. The function `pathResolve` has beed modified, now using an environment variable to detect if you want to use source or transpiled code.

If you still need support for earler node versions, check:
- [@bleed-believer/path-alias v0.15.2](https://www.npmjs.com/package/@bleed-believer/path-alias/v/0.15.2) or earlier.
- [ts-path-mapping](https://www.npmjs.com/package/ts-path-mapping) _(deprecated)._

## Installation
Install this package as a dependency (now [ts-node](https://www.npmjs.com/package/ts-node) is included as dependency):
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
│   └── ...
│
│   # The project configuration files
├── package.json
├── package-lock.json
└── tsconfig.json
```

### Configure your `tsconfig.json`
This package reads the `tsconfig.json` file (and is capable to find values if the file extends another configuration files) to declare the alias. A typical configuration coul be similar to this:
```json5
{
    "compilerOptions": {
        "target": "es2022",
        "module": "es2022", /* or "esnext" if you want (not tested yet) */

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

The fields `"rootDir"`, `"outDir"` and `"baseUrl"` are all optional. If you don't define any of these parameters, the loader will set __your current working directory__ as value. If you don't define `"paths"`, the loader will skip the paths alias routing (but if you make that, what's the sense of using this library in first place?).

## Executing your code
You have 2 ways to launch your program, using directly the loader provided, or using the cli included in the package.

### Using the cli
- Execute the source code with __ts-node:__
    ```bash
    npx bb-path-alias ./src/index.ts
    ```

- Execute the transpiled code:
    ```bash
    npx bb-path-alias ./dist/index.js
    ```

### Using the cli (installed globally with `npm i --g @bleed-believer/path-alias`)
- Execute the source code with __ts-node:__
    ```bash
    bb-path-alias ./src/index.ts
    ```

- Execute the transpiled code:
    ```bash
    bb-path-alias ./dist/index.js
    ```

### Using the `--import` flag
- Execute the source code with __ts-node:__
    ```bash
    node --import @bleed-believer/path-alias ./src/index.ts
    ```

- Execute the transpiled code:
    ```bash
    node --import @bleed-believer/path-alias ./dist/index.js
    ```

## Using `pathResolve` Function

The `pathResolve` function in `@bleed-believer/path-alias` dynamically resolves paths based on your project's context, influenced by the `RESOLVE_SRC` environment variable.

### Configuration in `tsconfig.json`
- `outDir`: `./dist`
- `rootDir`: `./src`

### Setting Environment Variables
To set the `RESOLVE_SRC` environment variable, you can prepend it when executing your TypeScript code. This dictates how `pathResolve` functions:

```bash
# Set RESOLVE_SRC=true for source code resolution
RESOLVE_SRC=true ts-node your-script.ts

# Without setting RESOLVE_SRC, or setting it to false, for transpiled code resolution
ts-node your-script.ts
```

### Example Usage
```ts
import { pathResolve } from '@bleed-believer/path-alias';

// With RESOLVE_SRC=true
console.log(pathResolve('path/to/file.js'));
// Output: home/user/project/src/path/to/file.js

// With RESOLVE_SRC not set or set to a value other than true
console.log(pathResolve('path/to/file.js'));
// Output: home/user/project/dist/path/to/file.js
```

This approach gives you flexibility in managing paths during development and production stages of your project.

## Unit testing with [ava](https://www.npmjs.com/package/ava)

Create in your folder where your package.json is located a file called `"ava.config.mjs"`. Assuming that your `"rootDir"` is `"./src"`, set that file like this:

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
        '--import=@bleed-believer/path-alias'
    ]
}
```

## About SWC
In case you want to execute your project using ts-node, the command is the same:
```bash
# Using the cli locally
npx bb-path-alias ./src/index.ts

# ...or using the cli globally
bb-path-alias ./src/index.ts

# ...or using the loader
node --import @bleed-believer/path-alias ./src/index.ts
```
However if you need to executed your transpiled project by [swc](https://swc.rs), you don't need to use the loader, just call your root file (because swc replaces the alias for the real paths by itself):

```bash
node ./dist/index.js
```
The function `pathResolve` works perfectly with __swc__ using the example of above, so you don't need to use the loader in transpiled code to keep the `pathResolve` function working.