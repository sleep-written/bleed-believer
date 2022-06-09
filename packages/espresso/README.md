# @bleed-believer/espresso

An scalable endpoint router for [express.js](https://www.npmjs.com/package/express) applications, using classes as Controller and decorators.

Now this package is compatible with __CommonJS__ and __ECMAScript Modules__.


## Prerequisites

In your project you must have installed locally [express.js](https://www.npmjs.com/package/express) framework with its type definitions:
```bash
# Install typescript
npm i --save-dev typescript

# Install the types for development
npm i --save-dev @types/node
npm i --save-dev @types/express

# Install express.js
npm i --save express
```

In your `tsconfig.json`, remember to enables these options:
```json
{
    "compilerOptions": {
        /** ... **/
        "emitDecoratorMetadata": true,
        "experimentalDecorators": true,
        "allowSyntheticDefaultImports": true,
        /** ... **/
    }
}
```


## Installation

After install the required dependencies, you can install this package:
```bash
npm i --save @bleed-believer/espresso
```


## Documentation
1. [Getting started.](/docs/espresso/getting-started.md)
1. [Creating a controller.](/docs/espresso/controllers.md)
1. [Creating routes.](/docs/espresso/routes.md)
1. [Routing injection.](/docs/espresso/injection.md)