# nx monorepo example

This is a monorepo example, created by [arjunyel](https://github.com/arjunyel) and using [nx](https://nx.dev/). Uses [@bleed-believer/path-alias](https://www.npmjs.com/package/@bleed-believer/path-alias) to execute the source code while you develop, and uses [tsc-alias](https://www.npmjs.com/package/tsc-alias) to normalize the alias in the transpiled project.

## Setup
Install all dependencies:
```sh
npm ci
```

Execute the source files:
```sh
npx nx start monorepo-app
```

Transpile your project:
```sh
npx nx build monorepo-app
```
    
Execute the transpiled project:
```sh
node ./dist/apps/monorepo-app/src/main.mjs
```