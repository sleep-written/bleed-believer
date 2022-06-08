# Commander

`Commander` is the class which you can deploys the routes and commands declared through your app. This class also determines how the execution arguments will be parsed by the library.

## How to use

A basic setup looks like this __(ES2022)__:

```ts
import { Commander } from '@bleed-believer/commander';

// This is the root routing class of the application
import { AppRouting } from './app.routing.js';

try {
    // Create a new instance
    const app = new Commander(AppRouting);

    // Execute the program
    await app.execute();
} catch (err: any) {
    // Catch errors
    console.log('ERROR:');
    console.log(err?.message);
}
```

Or in early ECMAScript versions:
```ts
import { Commander } from '@bleed-believer/commander';

// This is the root routing class of the application
import { AppRouting } from './app.routing.js';

// Create a new instance
const app = new Commander(AppRouting);
app
    .execute()  // Execute the program
    .catch(err => {
        // Catch errors
        console.log('ERROR:');
        console.log(err?.message);
    });

```

<br />

The `Commander` constructor accepts 2 arguments: The root routing class (required), and a object with options (optional). The Options available are:

- __"linear"__ (default: `false`):
    > By default, the key (with format `--key`) gather only the value immediately next to it right. If you set the linear mode to true, all values placed to the right of the current key will be assigned to that key, until another key has been defined.

- __"lowercase"__ (default: `false`):
    > If this value is true, all keys (with format `--key`) will be converted to lowercase before to be parsed. That allows to group values with case insensitive.