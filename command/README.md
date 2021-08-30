# @bleed-believer/command

This is a [BleedBeliever](https://www.npmjs.com/package/@bleed-believer/core) module to make command routing from arguments passed by the user through the command console.

## Installation

First install the [@bleed-believer/core](https://www.npmjs.com/package/@bleed-believer/core) package:
```npm
npm i --save @bleed-believer/core
```

Then, install this package:
```npm
npm i --save @bleed-believer/command
```

## Usage

First, you must make a `Command` class using the according decorators:
```ts
import { Command, CommandMethod } from '@bleed-believer/command';

@Command({
    main: [ 'start' ],
    title: 'Start command'
})
export class StartCommand {
    @CommandMethod()
    start(): void {
        console.log('Hello World');
    }
}
```

Then, create a module with your commands:
```ts
import { CommandRouter } from '@bleed-believer/command';
import { BleedModule } from '@bleed-believer/core';

import { StartCommand } from './start-command';
import { StopCommand } from './stop-command';

@BleedModule({
    imports: [
        CommandRouter.addToRouter([
            StartCommand,   // The class created above
            StopCommand     // Another command class
        ])
    ]
})
export class AppRouting {}
```

Finally, Add your `AppRouting` module as a parameter into the `BleedBeliever` constructor, and initialize the bleeding process:
```ts
import { BleedBeliever } from '@bleed-believer/core';
import { AppRouting } from './app-routing';

const main = new BleedBeliever(AppRouting);
main.bleed();
```
