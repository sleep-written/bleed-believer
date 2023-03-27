# @bleed-believer/meta
Adds metadata easifuly to your objects.

## Disclaimer
Since __ESM__ hs been heavely adopted by the whole `node.js` community (including transpilers, unit testing, and many other libraries), the __CJS__ support has been removed. If you still needs the __CJS__ compatibility, please use [this version](https://www.npmjs.com/package/@bleed-believer/meta/v/0.10.3) or earlier.

## Installation
Use npm to get the last version:
```bash
npm i --save @bleed-believer/meta
```

<br />

## Concepts
To understand how this library works, first we need to define some concepts:

### _Target:_
Any object that you want to write inside of, data about itself. It's common, for example, have classes that you need to specify how these classes will be instantiated and used for a particular third party tool or library. So in thoses cases you may need to write data dinamically into the prototype por example.

### _Metadata:_
The data do you want to attach to the target. This data normally describes how to use the target object to another one that requires for it. We use interfaces to describe the structure of a kind of metadata.


## How to use
-   First create an interface with the structure of your metadata:
    ```ts
    export interface EndpointMeta {
        path:   string;
        routes: {
            method: string;
            key:    string;
        }[];
    }
    ```

-   Create a new instance of `MetaManager`:
    ```ts
    export const ENDPOINT = new MetaManager<EndpointMeta>();
    ```

-   Now you can attach metadata into your objects:
    ```ts
    import { ENDPOINT } from './endpoint.js';

    export class UserController {
        get(): Promise<void> {
            // bla bla bla bla bla bla
        }
        
        set(): Promise<void> {
            // bla bla bla bla bla bla
        }
    }

    ENDPOINT.set(UserController, {
        path: 'user',
        routes: [
            { method: 'GET',    key: 'get' },
            { method: 'POST',   key: 'set' },
        ]
    });
    ```

-   ...or get its metadata:
    ```ts
    import { UserController } from './user.controller.js';
    import { ENDPOINT } from './endpoint.js';

    const meta = ENDPOINT.get(UserController);
    console.log(meta);
    // Prints:
    // {
    //     path: 'user',
    //     routes: [
    //         { method: 'GET',    key: 'get' },
    //         { method: 'POST',   key: 'set' },
    //     ]
    // }
    ```