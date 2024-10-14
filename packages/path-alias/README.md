# @bleed-believer/path-alias
A comprehensive library designed to streamline the execution of TypeScript code with [SWC](https://swc.rs/). It offers a variety of features aimed at simplifying TypeScript project setup and improving efficiency. Key functionalities include:

- **Direct TypeScript Execution**: Run TypeScript files directly through an integrated CLI or by using the `--import` flag, powered by SWC.
- **Minimal Configuration**: Requires only the project's `tsconfig.json` to operate, making setup quick and straightforward.
- **Path Alias Resolution**: Automatically resolves path aliases defined in `tsconfig.json`, allowing you to use more readable imports without complex configurations.
- **Internal Transpilation with Resolved Aliases**: Transpiles TypeScript files internally, producing JavaScript code with resolved path aliases, ready for direct execution with Node.js.
- **Support for Pre-Transpiled Projects**: Capable of executing pre-transpiled projects that may not have resolved path aliases, ensuring compatibility across different project setups.
- **Source Map Generation**: Generates source maps for seamless debugging, allowing you to debug directly in TypeScript with accurate mappings to the original code.

By using `@bleed-believer/path-alias`, you can replace cumbersome relative imports, such as:

```ts
import { UserController } from '../../../../controllers/user/user-controller.js';
import { CSVGenerator } from '../../../tool/csv-generator.js';
import { AuthService } from '../../../services/auth/auth-service.js';
import { Client } from '../../../../entities/client.js';
```

...with cleaner and more intuitive path aliases, like:

```ts
import { UserController } from '@controllers/user/user-controller.js';
import { CSVGenerator } from '@tool/csv-generator.js';
import { AuthService } from '@services/auth/auth-service.js';
import { Client } from '@entities/client.js';
```

## Disclaimer
This library has been completely rewritten from the ground up, removing all dependencies on `ts-node` in favor of [SWC](https://swc.rs/) for faster and more efficient TypeScript transpilation. **Please note that this represents a breaking change compared to version 1.1.3**, as both the execution process and core functionality have been significantly altered. Upgrading to this version may require updates to your current project setup to align with these new capabilities and configurations.

## Usage Guide
1.  **Install the library**:

    ```bash
    npm i --save @bleed-believer/path-alias
    ```

2. **Configure your `tsconfig.json`**:

    `@bleed-believer/path-alias` automatically translates your TypeScript configuration from `tsconfig.json` to a format that SWC can interpret. Let’s break down how the configuration is adapted:

    - **Compiler Options**:
      - The `target` and `module` settings (e.g., `"ES2022"` and `"Node16"`) define how the code will be compiled, specifying the ECMAScript version and module system.
      - SWC is configured to recognize TypeScript syntax, and settings like `emitDecoratorMetadata` and `experimentalDecorators` enable support for decorators.
      - `sourceMap` and `inlineSources` determine whether source maps are generated inline for debugging.

    - **Path Aliases**:
      - The `baseUrl` and `paths` options in your `tsconfig.json` allow you to define aliases for directories within your project. For example, `@greetings/*` maps to `./greetings/*`.
      - The library automatically resolves these path aliases during transpilation, so your JavaScript output reflects these simpler import paths.

    - **Module Settings**:
      - `@bleed-believer/path-alias` ensures compatibility with `"module"`    values like `Node16` and `ES2022`. When using modules not supported by    SWC, it throws an error for unsupported configurations, ensuring clarity   and consistency in your setup.

    Here’s an example of a compatible `tsconfig.json`:
    ```json
    {
      "compilerOptions": {
        "target": "ES2022",
        "module": "Node16",
        "moduleResolution": "Node16",

        "strict": true,
        "verbatimModuleSyntax": true,
        "emitDecoratorMetadata": true,
        "experimentalDecorators": true,

        "outDir": "./dist",
        "rootDir": "./src",
        "baseUrl": "./src",

        "paths": {
          "@greetings/*": [ "./greetings/*" ],
          "@tool/*": [ "./tool/*" ]
        }
      }
    }
    ```

3.  **Run your code**:
    You can now execute your TypeScript code with the following commands:
    ```bash
    # To run using the CLI
    npx bb-path-alias start ./src/index.ts
    
    # To run using the --import flag
    node --import @bleed-believer/path-alias ./src/index.ts
    ```

## Run Already Transpiled Code
If you have pre-transpiled code but your path aliases haven't been resolved, you can use this library to execute that code directly:

```bash
# To run using the CLI
npx bb-path-alias start ./dist/index.js

# To run using the --import flag
node --import @bleed-believer/path-alias ./dist/index.js
```

## Transpile the Project
To transpile your project using the integrated CLI, follow these commands:

```bash
# Transpile using the default configuration at ./tsconfig.json
npx bb-path-alias build

# Transpile using a custom configuration file
npx bb-path-alias build ./tsconfig.build.json
```

This functionality makes it easy to switch between direct execution and manual transpilation, allowing you to resolve path aliases seamlessly in both workflows.

## Utils

The following utility functions enhance the functionality of `@bleed-believer/path-alias` by providing additional support for handling TypeScript source files and resolving paths dynamically based on the code's context.

### `isSourceCode(url: string)`

This function determines whether the provided URL corresponds to a TypeScript source file.

- **Parameters**:
  - `url` (string): The URL or file path to check.

- **Returns**: `true` if the URL corresponds to a TypeScript file, `false` otherwise.

- **Usage**: This function is especially useful for conditional logic based on the file type (TypeScript vs. JavaScript). For example, if certain operations should only be performed on TypeScript files, this function helps enforce that condition.

- **Example**:
  ```ts
  // Checking if a file is TypeScript
  const isTs = isSourceCode('/path/to/file.ts');
  console.log(isTs); // Output: true

  // Checking if a file is JavaScript
  const isTs = isSourceCode('/path/to/file.js');
  console.log(isTs); // Output: false
  ```
  This example demonstrates how to use `isSourceCode` to check the file type based on its extension.

### `pathResolve(input: string, options?: { url?: string; multi?: boolean })`

This function resolves the absolute path(s) of the specified input, adapting based on whether the code is running in TypeScript or JavaScript mode, and the provided options.

- **Parameters**:
  - `input` (string): The relative path or alias to resolve.
  - `options` (object, optional):
    - `url` (string, optional): The URL or file path of the calling module. This is used to determine if the calling code is TypeScript or JavaScript, based on the file extension. If not provided, the function assumes the calling code is TypeScript.
    - `multi` (boolean, optional): If set to `true`, returns an array of resolved paths. Defaults to `false`.

- **Returns**:
  - When `multi` is `false` or not provided, it returns a single string path.
  - When `multi` is `true`, it returns an array of string paths.

- **Functionality**:
  - The function uses the `tsconfig.json` configuration to resolve paths and aliases.
  - If the calling code is determined to be JavaScript (e.g., if `options.url` has a `.js` extension), the resolved paths will point to the compiled JavaScript files in the `outDir` directory.
  - If the calling code is TypeScript (e.g., if `options.url` has a `.ts` extension or if `url` is not provided), the resolved paths will point to the source TypeScript files in the `rootDir` directory.

- **Example**:
  ```ts
  // In a TypeScript file, resolving a single path
  const singlePath = pathResolve('@tool/example.ts', { url: __filename });
  console.log(singlePath); 
  // Output: /absolute/path/to/src/tool/example.ts

  // In a JavaScript file, resolving a single path
  const singlePath = pathResolve('@tool/example.ts', { url: __filename });
  console.log(singlePath); 
  // Output: /absolute/path/to/dist/tool/example.js

  // Resolving multiple paths in TypeScript
  const multiplePaths = pathResolve('@greetings/*.ts', { multi: true, url: __filename });
  console.log(multiplePaths);
  // Output: ['/absolute/path/to/src/greetings/hello.ts', '/absolute/path/to/src/greetings/welcome.ts', ...]
  ```
  This example shows how to use `pathResolve` to obtain the correct file paths based on the execution context and provided options.
The following utility functions enhance the functionality of `@bleed-believer/path-alias` by providing additional support for handling TypeScript source files and resolving paths dynamically based on whether the code is running in TypeScript or JavaScript.

### `isSourceCode()`
This function determines whether the current execution environment is parsing TypeScript source code.

- **Usage**: This function is especially useful for conditional logic based on the code type (source TypeScript vs. transpiled JavaScript). For example, if certain operations should only be performed on TypeScript files, this function helps enforce that condition.

- **Example**:
  ```ts
  if (isSourceCode()) {
    console.log("Running in TypeScript mode.");
  } else {
    console.log("Running in JavaScript mode.");
  }
  ```
  This example checks the environment and logs a message accordingly. This is helpful when you need to execute certain logic only in TypeScript mode.

### `pathResolve(input: string, multi?: boolean)`
This function returns the absolute path of a given input file, dynamically adapting based on the code type (TypeScript or JavaScript).

- **Parameters**:
  - `input` (string): The relative path or alias to resolve.
  - `multi` (boolean, optional): If set to `true`, it returns an array of paths instead of a single path. Defaults to `false`.

- **Returns**: 
  - When `multi` is `false` or not provided, it returns a single string path.
  - When `multi` is `true`, it returns an array of string paths.

- **Example**:
  ```ts
  // Resolving a single path
  const singlePath = pathResolve('@tool/example.ts');
  console.log(singlePath); 
  // Output: /absolute/path/to/src/tool/example.ts (or /absolute/path/to/dist/tool/example.js in JavaScript mode)

  // Resolving multiple paths
  const multiplePaths = pathResolve('@greetings/*.ts', true);
  console.log(multiplePaths);
  // Output: ['/absolute/path/to/src/greetings/hello.ts', '/absolute/path/to/src/greetings/welcome.ts', ...]
  ```

- **Functionality**:
  - If the code is running as TypeScript, the function returns paths relative to `rootDir`.
  - If the code is running as JavaScript, it maps paths to the transpiled output in `outDir`.

These utility functions provide a powerful way to dynamically resolve paths and handle file extensions in projects that involve both TypeScript source files and their corresponding JavaScript outputs.

## Unit Testing
The library is compatible with AVA (and likely with most testing libraries that support the `--import` flag). To use AVA with `@bleed-believer/path-alias`, simply create a `ava.config.mjs` file at the root of your project with the following configuration:

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

### Explanation:
- **files**: Specifies the patterns for test files. Here, it's set to include any `.test.ts` or `.test.mts` files within the `src` directory and its subdirectories.
- **extensions**: Configures AVA to treat `.ts` and `.mts` files as ES modules.
- **nodeArguments**: Adds the `--import` flag for `@bleed-believer/path-alias`, enabling path alias resolution for your tests.

This setup ensures that AVA can correctly resolve and execute tests written in TypeScript, leveraging the path aliases defined in your `tsconfig.json`.