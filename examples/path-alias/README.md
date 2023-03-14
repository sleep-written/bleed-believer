# simple app example

The is an example project to demonstrate how to use [@bleed-believer/path-alias](in a simple environment).

# Setup

Install all dependencies:
```sh
npm ci
```

Execute the source code:
```sh
# The full command
node --no-warnings --loader @bleed-believer/path-alias/esm ./src/index.ts

# ...or use the provided script to less command length:
./start.sh ./src/index.ts
```

Execute the transpiled files (using [tsc](https://www.npmjs.com/package/typescript)):
```sh
# Build the project
npm run build

# Execute the transpiled files
node --no-warnings --loader @bleed-believer/path-alias/esm ./dist/index.js

# The same as above but using the script provided
./start.sh ./dist/index.js
```

Execute the transpiled files (using [swc](https://www.npmjs.com/package/@swc/core)):
```sh
# Build the project
npm run build:swc

# Execute the transpiled files
# (with swc, @bleed-believer/path-alias is not required)
node ./dist/index.js
```