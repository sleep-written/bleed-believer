# @bleed-believer/path-alias
This package enables on-the-fly execution of TypeScript files by binding path aliases. It leverages ts-node exclusively for TypeScript files, ensuring efficient module loading. Additionally, it provides utilities for dynamic path generation, adapting to your code's runtime context. Enhanced to support projects transpiled with [swc](https://swc.rs) (details [here](#about-swc)), it now also offers monorepo support (more information [here](#monorepo-support)). Say goodbye to cumbersome imports like this:
```ts
import { Jajaja } from '../../../../../../../jajaja.js';
import { Gegege } from '../../../../../gegege.js';
```

...and instead use aliases like these (with the power of intellisense):
```ts
import { Jajaja } from '@alias-a/jajaja.js';
import { Gegege } from '@alias-b/gegege.js';
```

## Disclaimer
### Monorepo support
While this package offers preliminary support for monorepos, it's important to note that this feature has not been extensively tested. As such, we do not recommend implementing it directly in a production-level monorepo environment at this time. We encourage users to test it in a controlled setting before considering it for critical applications. Your feedback and issue reports regarding monorepo support are highly appreciated and will aid in improving future releases.

### About Node v20
Since Node v20, the usage of the `--loader` flag has changed, with every loader now executed in isolated threads. Node's documentation recommends using the `--import` flag. Significant changes in the library's source code were made to support this new flag. The utility function `isTsNode` is currently non-functional. The function `pathResolve` has been modified to use an environment variable for choosing between source or transpiled code. For earlier Node versions, consider using:
-   [@bleed-believer/path-alias v0.15.2](https://www.npmjs.com/package/@bleed-believer/path-alias/v/0.15.2) (up to node v18).
-   [ts-path-mapping](https://www.npmjs.com/package/ts-path-mapping) (deprecated).

## Installation
Install this package as a dependency (now [ts-node](https://www.npmjs.com/package/ts-node) is included as dependency):
```bash
# Local installation
npm i --save @bleed-believer/path-alias

# ...or global installation
npm i --g @bleed-believer/path-alias
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
This package reads the `tsconfig.json` file (and is capable to find values if the file extends another configuration files) to declare the alias. A typical configuration could be similar to this:
```json5
{
    "compilerOptions": {
        "target": "ES2022",
        "module": "Node16",
        "moduleResolution": "Node16",
        
        "outDir": "./dist",
        "rootDir": "./src",
        "baseUrl": "./src",
        "paths": {
            "@alias-a/*": ["./folder-a/*"],
            "@alias-b/*": ["./folder-b/*"]
        }
    }
}
```

The fields `"rootDir"`, `"outDir"` and `"baseUrl"` are all optional. If you don't define any of these parameters, the loader will set __your current working directory__ as value. If you don't define `"paths"`, the loader will skip the paths alias routing.

## Executing your code
You have 2 ways to launch your program, using directly the loader provided, or using the cli included in the package.

### Using the cli
-   Execute the source code with __ts-node:__
    ```bash
    npx bb-path-alias ./src/index.ts
    ```

-   Execute the transpiled code:
    ```bash
    npx bb-path-alias ./dist/index.js
    ```

### Using the cli (installed globally)
-   Execute the source code with __ts-node:__
    ```bash
    bb-path-alias ./src/index.ts
    ```
-   Execute the transpiled code:
    ```bash
    bb-path-alias ./dist/index.js
    ```

### Using the `--import` flag
-   Execute the source code with __ts-node:__
    ```bash
    node --import @bleed-believer/path-alias ./src/index.ts
    ```

-   Execute the transpiled code:
    ```bash
    node --import @bleed-believer/path-alias ./dist/index.js
    ```

## Using `pathResolve` Function
The `pathResolve` function in `@bleed-believer/path-alias` dynamically resolves paths based on your project's context, influenced by the `RESOLVE_SRC` environment variable.

# Setting Environment Variables
To set the `RESOLVE_SRC` environment variable, you can prepend it when executing your TypeScript code. This dictates how `pathResolve` works:
```bash
# Set RESOLVE_SRC=true for source code resolution
RESOLVE_SRC=true node --import @bleed-believer/path-alias ./src/index.ts

# Without setting RESOLVE_SRC, or setting it to false, for transpiled code resolution
node --import @bleed-believer/path-alias ./dist/index.js
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

## About [swc](https://swc.rs)
In case you want to execute your project using ts-node, the command is the same:
```bash
# Using the cli locally
npx bb-path-alias ./src/index.ts

#...or using the cli globally
bb-path-alias./src/index.ts

#...or using the loader
node --import @bleed-believer/path-alias./src/index.ts
```

However if you need to executed your transpiled project by [swc](https://swc.rs), you don't need to use the loader, just call your root file (because swc replaces the alias for the real paths by itself):
```bash
node./dist/index.js
```

The function `pathResolve` works perfectly with __swc__ using the example of above, so you don't need to use the loader in transpiled code to keep the `pathResolve` function working.