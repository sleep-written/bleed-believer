# Routing Injection

Finally, to attach your routes into an `express.js` instance, you must create a new `Espresso` instance. Using the example described [here](/docs/espresso/getting-started.md#folder-structure), the `index.ts` file looks like this:

```ts
import express from 'express';
import { Espresso } from '@bleed-believer/espresso';
import { ApiRouting } from './api.routing';

// Create your express.js instance
const app = express();

// Create a new Espresso instance
// (the 2nd argument is optional)
const espresso = new Espresso(app, {
    lowercase: false,
    verbose: false
});

// Inject your root "ControllerRouting" class
espresso.inject(ApiRouting);

// Start your api rest
app.listen(8080, () => console.log('Ready!'));
```

The order of injection is the following:
1. The __nested__ routes:
    1. The __nested__ routes:
        1. The __nested__ routes:
            1. `[...]`
        1. The __controllers__ of the current class.
    1. The __controllers__ of the current class.
1. The __controllers__ of the current class.

<br />

## Options

As you can see, when you create the `Espresso` instance, you can pass an object with some options about how to inject the routes into the `express.js` instance:
- __lowercase__ (`boolean`, optional):
    > If this options is `true`, all endpoints will be injected in lowercase.  Use this option if do you want to use the default controller names in lowercase without to set explicitly in all controllers.
    > 
    > ### Disclaimer:
    > If your `Controller` class has a name with multiples words (for example `BleedBelieverController`), the path of that class in lowercase mode will be `"bleed-believer"` (using `"-"` as word separator).

<br />

- __verbose__ (`boolean`, optional):
    > If this option is `true`, all injection process will be written in the terminal. This is useful if you need to see how this library parses every route before to inject into the target instance.

<br />

## Error handling

If you want to catch errors throwed by an endpoint, you can bind a callback for that purpose. For example:

```ts
import express from 'express';
import { Espresso } from '@bleed-believer/espresso';
import { ApiRouting } from './api.routing';

const app = express();
const espresso = new Espresso(app);
espresso.inject(ApiRouting);

// Send a JSON with the error message
espresso.onError((e, req, res) => {
    res.json({
        code:       e?.code ?? 500,
        message:    e.message
    });
});

app.listen(8080, () => {
    console.log('Ready!');
});
```