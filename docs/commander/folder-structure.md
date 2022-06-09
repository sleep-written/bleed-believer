# About the project files

When you make a proyect using this library, you must follows these indications to avoid problems when you using this library:

## Typescript

The library is designed to be used in typescript projects, so the usage in pure JS projects isn't covered by the development of it and __isn't recommended__ for those cases. So, before to install this library, first generate a `"./package.json"` and install typescript:

```bash
npm i --save-dev typescript
```
\* _We suggest use [ts-node](https://www.npmjs.com/package/ts-node) to simplify your development flow._

For __ESM__ projects, use a configuration like this:
```json
{
    "compilerOptions": {
        "target": "ES2022",

        /** For ESM projects **/
        "module": "ES2022",
  
        /** Required for decorators **/
        "experimentalDecorators": true,
        "emitDecoratorMetadata": true,

        "rootDir": "./src",
        "outDir": "./dist",
        "sourceMap": true,
  
        "strict": true,
        "moduleResolution": "node",
        "esModuleInterop": true
    }
}
```

For __CommonJS__ projects, use a configuration like this:
```json
{
    "compilerOptions": {
        "target": "ES2022",
        
        /** For CommonJS projects **/
        "module": "CommonJS",
  
        /** Required for decorators **/
        "experimentalDecorators": true,
        "emitDecoratorMetadata": true,

        "rootDir": "./src",
        "outDir": "./dist",
        "sourceMap": true,
  
        "strict": true,
        "moduleResolution": "node",
        "esModuleInterop": true
    }
}
```

<br />

## Folder structure

In general, you can use any folder structure as you wants, but the suggested structure as the follows (is the used in the whole documentation):

```bash
# Your current working directory
project-folder
│   # The project dependencies
├── node_modules
│
│   # The transpiled files
├── dist
│
│   # The source code
├── src
│   │   # A subroute with nested commands
│   ├── nested-route
│   │   │   # The command folder
│   │   ├── command-a
│   │   │   │   # The command file
│   │   │   ├── command-a.command.ts
│   │   │   └── ...
│   │   │
│   │   ├── ...
│   │   │
│   │   │   # The command folder
│   │   ├── command-n
│   │   │   │   # The command file
│   │   │   ├── command-n.command.ts
│   │   │   └── ...
│   │   │
│   │   │   # The nested route file
│   │   └── nested-route.routing.ts
│   │
│   │   # The command folder
│   ├── command-a
│   │   │   # The command file
│   │   ├── command-a.command.ts
│   │   └── ...
│   │
│   ├── ...
│   │
│   │   # The command folder
│   ├── command-n
│   │   │   # The command file
│   │   ├── command-n.command.ts
│   │   └── ...
│   │
│   │   # The main command route
│   ├── app.routing.ts
│   │
│   │   # The file when the app starts
│   └── index.ts
│
│   # The project configuration files
├── package.json
├── package-lock.json
└── tsconfig.json
```