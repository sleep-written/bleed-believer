# @bleed-believer/path-alias

**Note:** The latest stable version is [v1.1.3](https://www.npmjs.com/package/@bleed-believer/path-alias/v/1.1.3). This documentation refers to an alpha version currently available for testing.

## Introduction

`@bleed-believer/path-alias` simplifies your import statements by allowing you to use predefined path aliases in your TypeScript or JavaScript projects. Instead of writing long relative paths, you can use concise and descriptive aliases.

**Without Path Aliases:**

```ts
import { Jajaja } from '../../../../../../../jajaja.js';
import { Gegege } from '../../../../../gegege.js';
```

**With `@bleed-believer/path-alias`:**

```ts
import { Jajaja } from '@alias-a/jajaja.js';
import { Gegege } from '@alias-b/gegege.js';
```

## Features

- **Simplified Import Paths:** Use custom aliases to make your code cleaner and easier to maintain.
- **TypeScript and JavaScript Support:** Execute TypeScript source files or transpiled JavaScript files seamlessly.
- **Automatic `ts-node` Handling:** Runs `ts-node` internally for TypeScript files; skips it for JavaScript for faster execution.
- **Utilities Included:** Helpful functions like `isTsNode()` and `pathResolve()` for advanced use cases.
- **ESM Compatibility:** Designed for projects using ECMAScript modules (ESM) with Node.js v20 or higher.

## Installation

Install the library using npm:

```bash
npm install @bleed-believer/path-alias
```

> **Note:** `ts-node` is included as a dependency.

## Quick Start

### Project Structure

Assuming a project with the following structure:

```
project-folder
├── node_modules/
├── dist/
│   ├── index.js
│   ├── folder-a/
│   └── folder-b/
├── src/
│   ├── index.ts
│   ├── folder-a/
│   └── folder-b/
├── package.json
└── tsconfig.json
```

### TypeScript Configuration

Your `tsconfig.json` should include the following settings:

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
      "@alias-b/*": ["./folder-b/*"],
      "@alias-c/*": ["./folder-c/*", "./folder-c-legacy/*"]
    }
  }
}
```

> **Note:** The `"paths"` property is essential for defining your custom aliases. The example paths provided are necessary to explain certain scenarios and should remain as shown.

### Running Your Code

You can execute your code with resolved path aliases using various methods:

- **Run TypeScript Source Files:**

  ```bash
  npx bb-path-alias ./src/index.ts
  ```

- **Run Transpiled JavaScript Files:**

  ```bash
  npx bb-path-alias ./dist/index.js
  ```

- **Using Node.js `--import` Flag with TypeScript:**

  ```bash
  node --import @bleed-believer/path-alias ./src/index.ts
  ```

- **Using Node.js `--import` Flag with JavaScript:**

  ```bash
  node --import @bleed-believer/path-alias ./dist/index.js
  ```

## Utilities

The library provides utility functions to enhance your development experience.

### `isTsNode()`

Checks if the current process is running with `ts-node`.

**Usage:**

```ts
import { isTsNode } from '@bleed-believer/path-alias/utils';

if (isTsNode()) {
  console.log('Running with ts-node');
} else {
  console.log('Running with compiled JavaScript');
}
```

### `pathResolve(path: string, multi?: boolean): string | string[]`

Resolves a given path based on your `tsconfig.json` settings.

- **Parameters:**
  - `path: string` - The path to resolve.
  - `multi?: boolean` - If `true`, returns all possible resolved paths as an array. Defaults to `false`.

**Features:**

- Automatically detects if `ts-node` is in use.
- Resolves paths relative to `"rootDir"` when running with `ts-node`, or `"outDir"` otherwise.
- Eliminates the need for environment variables like `RESOLVE_SRC`.

**Usage:**

```ts
import { pathResolve } from '@bleed-believer/path-alias/utils';

// Get a single resolved path
const resolvedPath = pathResolve('folder/file.js');
console.log(`Resolved path: ${resolvedPath}`);

// Get all possible resolved paths
const resolvedPaths = pathResolve('folder/file.js', true);
console.log('Resolved paths:', resolvedPaths);
```

## Advanced Usage

### Running Unit Tests with `ava`

Due to recent updates in TypeScript or the `ava` testing library, using `ava` with the `--import` flag alongside this library is not currently possible.

#### Workaround: Using `swc` for Transpilation

Transpile your project (including tests) with `swc`, which resolves path aliases, and run tests without the `--import` flag.

##### Step 1: Install Dependencies

```bash
npm install --save-dev @swc/core @swc/cli ava
```

##### Step 2: Update `tsconfig.json`

Include `"verbatimModuleSyntax": true` to ensure `swc` handles module syntax correctly.

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
      "@alias-b/*": ["./folder-b/*"],
      "@alias-c/*": ["./folder-c/*", "./folder-c-legacy/*"]
    }
  }
}
```

##### Step 3: Create `.test.swcrc`

Add a `.test.swcrc` file in your project root:

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
    "baseUrl": "./src",
    "paths": {
      "@alias-a/*": ["./folder-a/*"],
      "@alias-b/*": ["./folder-b/*"],
      "@alias-c/*": ["./folder-c/*", "./folder-c-legacy/*"]
    }
  },
  "sourceMaps": true
}
```

> **Important:** Ensure the `"baseUrl"` and `"paths"` match those in your `tsconfig.json`.

##### Step 4: Configure `ava`

Create an `ava.config.mjs` file:

```js
export default {
  files: [
    './dist/**/*.test.js',
    './dist/**/*.test.mjs',
  ]
};
```

##### Step 5: Run Tests

Transpile your code and run the tests:

```bash
# Transpile the project
npx swc ./src -d ./dist --config-file .test.swcrc

# Run tests
npx ava
```

## Node.js Version Compatibility

If you're using an older version of Node.js (e.g., Node.js v18), consider the following alternatives:

- [@bleed-believer/path-alias v0.15.2](https://www.npmjs.com/package/@bleed-believer/path-alias/v/0.15.2)
- [ts-path-mapping](https://www.npmjs.com/package/ts-path-mapping) (deprecated)

## Notes and Limitations

- **ESM Format Required:** The library is designed for projects using ECMAScript modules with Node.js v20 or higher.
- **Monorepo Support:** Monorepo setups have not been tested with this version.
- **Disclaimer:** Due to recent changes, it's currently not possible to use `ava` with this library and the `--import` flag. Use the `swc` workaround as described above.

## Conclusion

`@bleed-believer/path-alias` streamlines your import statements by enabling path aliases, making your codebase cleaner and easier to navigate. Whether you're running TypeScript source files or compiled JavaScript, the library handles path resolution seamlessly.

For any issues or contributions, feel free to visit the [GitHub repository](https://github.com/bleed-believer/path-alias).