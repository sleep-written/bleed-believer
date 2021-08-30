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

## Module Injection

Now this library has module injection support. In the `exports` options of any module, you can put there modules that has been initialized from `imports` option. For example this module, whichs has a websocket's connection:

```ts
import { BleedModule } from '@bleed-believer/core';
import { WebSocket } from 'ws';

@BleedModule({
    imports: [],
    exports: []
})
export class WebSocketModule {
    private _ws: WebSocket;

    constructor {
        this._ws = new WebSocket('https://www.example.com/ws/');
    }

    sendMessage(text: string): void {
        this._ws.send(text);
    }
}
```

Now chech this another module, whichs contains other modules:
```ts
import { BleedModule } from '@bleed-believer/core';
import { CommandRouter } from '@bleed-believer/command';

import { StartCommand } from './start.command';
import { WebSocketModule } from './web-socket.module';

@BleedModule({
    imports: [
        CommandRouter.addToRouter([ StartCommand ]),
        WebSocketModule
    ],
    exports: [
        WebSocketModule
    ]
})
export class ServerModule {}
```

Imagine that you need to use that exported module in the parent module. In that case:
```ts
import { BleedModule, Inject } from '@bleed-believer/core';


@BleedModule({
    imports: [ ServerModule ],
    exports: []
})
export class MainModule {
    constructor(
        @Inject(WebSocketModule) private _webSocket: WebSocketModule
    ) {
        this._webSocket.sendMessage('Almost ready!');
    }
}
```
In this example, you have access to `WebSocketModule` because this module has been exported by ServerModule. If you try to inject a module that didn't been exported by at leas one of the imported modules, the `BleedBeliever` will throws an `ModuleNotInitializedError` object type.

## Official modules

The official modules are listed there

- [@bleed-believer/command](https://www.npmjs.com/package/@bleed-believer/command): A module for resolve terminal arguments.

## Roadmap
- ✅ Implement the exports injection mechanism.
- 🟦 Create more modules to use.