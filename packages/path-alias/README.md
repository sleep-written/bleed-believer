# @bleed-believer/path-alias

This library allows you to execute code with predefined path aliases, helping you avoid deeply nested relative paths like this:

```ts
import { Jajaja } from '../../../../../../../jajaja.js';
import { Gegege } from '../../../../../gegege.js';
```

Instead, you can use cleaner, more maintainable paths like this:

```ts
import { Jajaja } from '@alias-a/jajaja.js';
import { Gegege } from '@alias-b/gegege.js';
```

## Features

- Internally, this library leverages `ts-node` to execute TypeScript source files directly.
- If you're running already transpiled code, the library skips `ts-node`, allowing for faster execution by running the plain JavaScript files directly.

## Disclaimer

- Due to recent changes, likely in TypeScript or the `ava` testing library, it is no longer possible to use `ava` with this library and the `--import` flag. Instead, transpile your project (including your unit tests) with `swc` (which resolves path aliases) and run the tests without using the `--import` flag.
- This library is designed to work with projects in ESM format using Node.js v20 or higher.
- Monorepo support has not been tested in this version.

### Node.js Version Compatibility

If you're using an earlier version of Node.js, you can use the following options:

- [@bleed-believer/path-alias v0.15.2](https://www.npmjs.com/package/@bleed-believer/path-alias/v/0.15.2) (compatible with Node.js v18).
- [ts-path-mapping](https://www.npmjs.com/package/ts-path-mapping) (deprecated).

## Installation

This library includes `ts-node` as a dependency. To install, run the following command:

```bash
npm i --save @bleed-believer/path-alias
```

## Usage

Consider the following project structure:

```bash
# Your current working directory
project-folder
│   # The project dependencies
├── node_modules
│
│   # The transpiled files
├── dist
│   │   # The file where the app starts
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
│   │   # The file where the app starts
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

And the following example TypeScript configuration:

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

Note that the `"outDir"`, `"rootDir"`, `"baseUrl"`, and `"paths"` properties are optional. This library can even read TypeScript configurations that extend other files. For more details, refer to [get-tsconfig](https://www.npmjs.com/package/get-tsconfig).

### Execution Options

You can execute the code with the following options:

- Run the source code (`*.ts`) using the integrated CLI:
    ```bash
    npx bb-path-alias ./src/index.ts
    ```

- Run the transpiled code (`*.js`) using the integrated CLI:
    ```bash
    npx bb-path-alias ./dist/index.js
    ```

- Run the source code (`*.ts`) using the `--import` flag:
    ```bash
    node --import @bleed-believer/path-alias ./src/index.ts
    ```

- Run the transpiled code (`*.js`) using the `--import` flag:
    ```bash
    node --import @bleed-believer/path-alias ./dist/index.js
    ```

## Utilities

The following utilities are available and can be imported from `@bleed-believer/path-alias/utils`:

### `isTsNode()`

Returns a boolean indicating whether the custom hooks of `ts-node` are being used. It stores a flag in the system's temporary files that indicates if the current process is using `ts-node`.

Example usage:

```ts
import { isTsNode } from '@bleed-believer/path-alias/utils';

if (isTsNode()) {
    console.log('Running with ts-node');
} else {
    console.log('Running with compiled JavaScript');
}
```

### `pathResolve('path/to/dir')`

Resolves the given path based on whether `ts-node` is in use. If `ts-node` is being used, the path will be resolved relative to the `"rootDir"` as specified in the TypeScript configuration. Otherwise, it will resolve the path relative to the `"outDir"`.

Thanks to how `isTsNode()` works, you no longer need to define the `RESOLVE_SRC` environment variable as required in previous versions.

Example usage:

```ts
import { pathResolve } from '@bleed-believer/path-alias/utils';

const resolvedPath = pathResolve('folder/file.js');
console.log(`Resolved path: ${resolvedPath}`);
```

## Running Unit Tests with `ava`

At the moment, it is not possible to run unit tests with `ava` using the `--import` flag alongside this library. As an alternative, you can set up your project to use `swc` for transpilation and run the tests without the `--import` flag. Follow the steps below:

### Step 1: Install the necessary dependencies

You'll need to install the following packages:

- [@swc/core](https://www.npmjs.com/package/@swc/core)
- [@swc/cli](https://www.npmjs.com/package/@swc/cli)
- [ava](https://www.npmjs.com/package/ava)

To install these, run the following command:

```bash
npm i --save-dev @swc/core @swc/cli ava
```

### Step 2: TypeScript configuration

Before configuring `swc`, ensure your TypeScript project is properly set up with the following `tsconfig.json`. The `verbatimModuleSyntax` option is required for `swc` to handle the module syntax correctly.

Add this to your `tsconfig.json`:

```json5
{
    "compilerOptions": {
        "target": "ES2022",
        "module": "Node16",
        "moduleResolution": "Node16",
        "verbatimModuleSyntax": true,
        
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

The `"verbatimModuleSyntax": true` option ensures that `swc` can correctly interpret and transpile your ES modules without modifying import/export statements.

### Step 3: Create `ava.config.mjs` in the project root

This configuration tells `ava` to run tests from the transpiled output (`dist` folder). Add the following to a file named `ava.config.mjs`:

```js
export default {
    files: [
        './dist/**/*.test.js',
        './dist/**/*.test.mjs',
    ]
};
```

### Step 4: Create `.test.swcrc` in the project root

This configuration file ensures `swc` properly transpiles the TypeScript code, including decorators, dynamic imports, and strict ES6 modules. Add the following to a file named `.test.swcrc`:

```json
{
  "$schema": "https://swc.rs/schema.json",
  "module": {
    "strict": true,
    "type": "es6",
    "resolveFully": true
  },
  "jsc": {
    "target": "es2022",
    "parser": {
      "syntax": "typescript",
      "decorators": true,
      "dynamicImport": true
    },
    "transform": {
      "decoratorMetadata": true
    },
    "baseUrl": "./src"
  },
  "sourceMaps": true
}
```

### Step 5: Run the tests

To transpile your project and execute the tests, use the following commands:

```bash
# Transpile the project using swc:
npx swc ./src -d ./dist --strip-leading-paths --config-file .test.swcrc

# Run the tests:
npx ava
```

This setup ensures that your project is transpiled with `swc`, resolving path aliases correctly, and allows you to run unit tests with `ava` without the `--import` flag.