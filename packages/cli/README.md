# bleed-believer cli

A `ts-node` replacement with path alias resolution, import maps support, and SWC under the hood.

---

## Basic usage

* Install the package:

  ```shell
  npm i --save-dev @bleed-believer/cli
  ```

* Launch your application (having a `tsconfig.json` is optional):

  ```shell
  ## Using the shortest executable name:
  npx bleed start ./src/index.ts

  ## ...or if you want the full executable name:
  npx @bleed-believer/cli start ./src/index.ts
  ```

If you don't have a `tsconfig.json` file in cwd, `@bleed-believer/cli` will run your application using this default configuration:

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

---

## CLI Commands

* `npx bleed start [target]`
  Run a TypeScript file using the custom ESM loader.

  * `[target]`: The file you want to execute.
  * `--watch` *(optional)*: Execute in watch mode.
  * `--` *(optional)*: Pass arguments to the TypeScript file.

* `npx bleed build`
  Transpile all files to JavaScript (similar to `tsc`, but faster).

  * `--watch` *(optional)*: Execute in watch mode.
  * `--config` *(optional)*: Sets a custom tsconfig JSON file.

---

## Import extension rewriting (`.ts` → `.js`)

When building for Node.js ESM, TypeScript files are emitted as `.js`, but import specifiers must also reference `.js` at runtime.

`@bleed-believer/cli` can **automatically rewrite import extensions** during build, based on your `tsconfig.json`.

### Supported compiler options

Enable one or both of the following options:

```json
{
  "compilerOptions": {
    "allowImportingTsExtensions": true,
    "rewriteRelativeImportExtensions": true
  }
}
```

### What this does

When enabled, the build step will:

* Detect imports ending in:

  * `.ts`
  * `.tsx`
  * `.mts`
  * `.cts`
* Verify that the target file exists and belongs to the project source tree.
* Rewrite the import to its `.js` equivalent **only when it is safe to do so**.

Example:

```ts
// Input
import { foo } from './utils.ts';

// Output
import { foo } from './utils.js';
```

Imports that resolve to external packages or non-project files are left untouched.

---

## Import maps support (`#` imports)

`@bleed-believer/cli` fully supports **Node.js import maps** via the `"imports"` field in `package.json`.

This allows you to use stable, absolute-style imports without relying on relative paths.

### Example `package.json`

```json
{
  "name": "@examples/commander",
  "type": "module",
  "imports": {
    "#root/*.ts": "./src/*.ts",
    "#root/*.js": "./dist/*.js"
  }
}
```

### How this works

* During development:

  ```ts
  import { foo } from '#root/utils.ts';
  ```

  resolves to:

  ```text
  ./src/utils.ts
  ```

* During build:

  * The import extension is rewritten to `.js`
  * The import map redirects it to:

    ```text
    ./dist/utils.js
    ```

This ensures:

* Clean absolute imports in source code
* Correct runtime resolution in Node.js
* No manual path rewriting
* Full compatibility with ESM

---

## Using custom loader

If you want to execute your file directly with Node.js using `@bleed-believer/cli` as a loader:

```shell
node --import @bleed-believer/cli ./src/index.ts
```

---

## Using with AVA

Create the file `ava.config.mjs` in the root folder with the following content:

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