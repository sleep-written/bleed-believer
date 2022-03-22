# About Routes

To organize and group your controllers, you need to implement routing classes in your application. Using the `api.routing.ts` file from [here](/docs/espresso/getting-started.md#folder-structure), a routing class look like this:

```ts
import { ControllerRouting } from '@bleed-believer/espresso';

import { DocumentsRouting } from './documents/documents.routing.ts';
import { UserController } from './user.controller.ts';

@ControllerRouting({
    routes: [
        DocumentsRouting
    ],
    controllers: [
        UserController
    ]
})
export class ApiRouting {}
```

You can optionally add a path, for example, check `documents.routing.ts`:

```ts
import { ControllerRouting } from '@bleed-believer/espresso';

import { QuotationController } from './quotation.controller.ts';
import { ContractController } from './contract.controller.ts';

@ControllerRouting({
    path: 'Documents',
    controllers: [
        QuotationController,
        ContractController
    ]
})
export class ApiRouting {}
```
When a Routing class has the `"path"` option setted, all routes and controlles attached to this routing class will attach it as a folder before heir respective entire route. For example, all endpoints inside `"quotation.controller.ts"` using the example of above, would be now:

| HTTP Method | Path                                |
|:-----------:|-------------------------------------|
| GET         | <u>__/Documents__</u>/Quotation/:id |
| POST        | <u>__/Documents__</u>/Quotation/    |

