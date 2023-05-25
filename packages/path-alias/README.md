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

## About monorepo support
Now this package has monorepo support, thanks for [arjunyel](https://github.com/arjunyel) colaboration, and for now it's an _<u>__experimental function.__</u>_ This functionality was tested only with [NX](https://nx.dev/) monorepo, for that reason please first check [this example](https://github.com/sleep-written/bleed-believer/tree/master/examples/path-alias-monorepo) and test the package functionality in your specific use cases __before to implement in production.__

## Disclaimers
Since __ESM__ hs been heavely adopted by the whole `node.js` community (including transpilers, unit testing, and many other libraries), from now (from [v0.10.17](https://www.npmjs.com/package/@bleed-believer/path-alias/v/0.10.17) exactly) the __CJS__ support has been removed. If you still needs the __CJS__ compatibility, considerate these options:
- [@bleed-believer/path-alias v0.10.16](https://www.npmjs.com/package/@bleed-believer/path-alias/v/0.10.16) or earlier.
- [ts-path-mapping](https://www.npmjs.com/package/ts-path-mapping) _(deprecated)._

This package is heavely inspired in [this response](https://github.com/TypeStrong/ts-node/discussions/1450#discussioncomment-1806115), so I give my gratitude to the [charles-hallen](https://github.com/charles-allen) work. If you see that the [Loader API](https://nodejs.org/api/esm.html#loaders) has been changed and this package stopped working, create an GitHub Issue notifying of the problem.

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

### Using the loader
- Execute the source code with __ts-node:__
    ```bash
    node \
    --loader @bleed-believer/path-alias \
    ./src/index.ts
    ```

- Execute the transpiled code:
    ```bash
    node \
    --loader @bleed-believer/path-alias \
    ./dist/index.js
    ```

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
        '--no-warnings',
        '--loader=@bleed-believer/path-alias'
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

Resolve any subfolder of `"rootDir"` depending if __ts-node__ is running. For example, imagine do you want to resolve the path `"./src/folder-a/inner/*"`:

```ts
import { pathResolve } from '@bleed-believer/path-alias';

const path = pathResolve('folder-a', 'index.ts');
console.log('path:', path);
```

With __ts-node__ the output is:
```bash
node \
--loader @bleed-believer/path-alias \
./src/folder-a/index.ts

# path: /current/working/directory/src/folder-a/index.ts
```

With the transpiled code:
```bash
node \
--loader @bleed-believer/path-alias \
./dist/folder-a/index.js

# path: /current/working/directory/dist/folder-a/index.js
```

## About SWC

In case you want to execute your project using ts-node, the command is the same:
```bash
# Using the cli locally
npx bb-path-alias ./src/index.ts

# ...or using the cli globally
bb-path-alias ./src/index.ts

# ...or using the loader
node \
--loader @bleed-believer/path-alias \
./src/index.ts
```
However if you need to executed your transpiled project by [swc](https://swc.rs), you don't need to use the loader, just call your root file (because swc replaces the alias for the real paths by itself):

```bash
node ./dist/index.js
```
The function `pathResolve` works perfectly with __swc__ using the example of above, so you don't need to use the loader in transpiled code to keep the `pathResolve` function working.

## Limitations

- The library requires a `"tsconfig.json"` file into the current working directory to work. Doesn't matter if that file extends another file, or be a part of a set of inhetirance, __while all required properties are accesible through its ancestors.__

- The resolve output between `"baseURL"` and the `"paths"` declared in the `"tsconfig.json"` file must always return a path inside of `"rootDir"` folder.

- __swc__ isn't compatible with alias for a single file, like this: `"@data-source": ["./data-source.ts"]`.