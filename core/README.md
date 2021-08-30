# @bleed-believer/core

This is a minimalistic module system inspired by the modules of Angular. This package contains the core of the module managment, and can be extended with official modules, or create your own modules. For install the core package, you can use:
```npm
npm i --save @bleed-believer/core
```

## How it works?

Every part of this architecture use set of modules, making a __tree dependency__ between them. When every module is resolved, the core creates a new instance of every module, from the root of the base module, to the every branch of the module dependency.

### BleedModule

A `BleedModule` is a class that will be used by the `BleedBeliever` core as a singleton. Every `BleedModule` can import and export modules, making a <u>module dependency tree</u> between them. The basic structure of a `BleedModule` is:

```ts
import { BleedModule } from '@bleed-believer/core';

@BleedModule({
    imports: [],
    exports: []
})
export class MyModule {
    constructor() {
        console.log('Hi, I\'m a new instance!');
    }
}
```

You can make your module dependency tree as follows:
```ts
import { BleedModule } from '@bleed-believer/core';

@BleedModule({
    imports: [],
    exports: []
})
export class ModuleA {}

@BleedModule({
    imports: [],
    exports: []
})
export class ModuleB {}

@BleedModule({
    imports: [
        ModuleA,
        ModuleB
    ],
    exports: []
})
export class ModuleRoot {}
```

So, in this case, the module dependency tree is:
```
ModuleRoot
├── ModuleA
└── ModuleB
```

### `BleedBeliever`

The `BleedBeliever` class manages the module dependency tree. The constructor requests a `BleedModule` as root to begin the <u>bleeding process.</u> The __bleeding process__ can be called using `this.bleed();` method, and consists in:
- Get all imported modules.
- Execute this process recursivelly with the imported modules.
- Create a new instance of this current module.

For that reason, the first modules that will be instantiated are the most external modules. With the above example, <u>The first classes that will be instantiated will be ModuleA and ModuleB, before BaseModule.</u> To use this class, with the above example:
```ts
import { ModuleRoot } from './module-root';

const main = new BleedBeliever(ModuleRoot);
main.bleed();
```

## Official modules

The official modules are listed there

- [@bleed-believer/command](https://www.npmjs.com/package/@bleed-believer/command): A module for resolve terminal arguments.

## Roadmap
- [ ] Implement the explor injection mechanism.
- [ ] Create more modules to use.