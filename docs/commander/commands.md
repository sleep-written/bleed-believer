# Commands

Commands are the core of this library. Strictly speaking, a command is a class that will be instantiated only if __it's required arguments <u>matches</u> with the execution arguments__, for executes its `start(...)` method.

## Declaring a command class

To declaring a command class you must implements the `Executable` interface, and use the `@Command` decorator. For example:

```ts
import { Command, Executable } from '@bleed-believer/commander';

@Command({
    main: [ 'setup' ],
    name: 'Setup Project.',
    info: 'This command configures your application.'
})
export class SetupCommand implements Executable {
    // This method will be called when if
    // this command is instantiated
    start(): void {
        console.log('This is the setup command!');
    }
}
```

The object sended as `@Command` parameter has this properties:
- __"main"__ (`string | string[]`):
    > It's the required arguments to execute this command.
- __"name"__ (`string`):
    > A friendly name to this command.
- __"info"__ (`string`, _optional_):
    > Detailed information about the usage of this command.

<br />

## Getting the `Argv` object

You can get the parsed execution arguments through the `Argv` object (see [here](./execution-arguments.md/#the-argv-interface)). To get this object, add the `Argv` interface as the first parameter of your `start(...)` method, for example:

```ts
import { Command, Executable, Argv } from '@bleed-believer/commander';

@Command({
    main: [ 'setup' ],
    name: 'Setup Project.',
    info: 'This command configures your application.'
})
export class SetupCommand implements Executable {
    start(argv: Argv): void {
        console.log('This is the setup command!');
        console.log('main args:', argv.main);
        console.log('opts args:', argv.opts);
    }
}
```

## Using wildcards

__If you want to capture data from the _required arguments___, you can use wildcards into the `"main"` options of the `@Command` decorator. To get those captured values, you must add the `ArgvData` interface as second parameter to your `start(...)` method.

<br />

### Wildcard `":name"`

Using `:` with a name, for example `":file"` you can capture the argument at this exact position. All of this wildcards are accesible in the `"param"` key of the `ArgvData` object. Watch this example:
```ts
import { Command, Executable, Argv, ArgvData } from '@bleed-believer/commander';

@Command({
    main: [ 'watch', ':file' ],
    name: 'Watch File.'
})
export class WatchCommand implements Executable {
    start(argv: Argv, data: ArgvData): void {
        console.log('target ->', data.param.file);
    }
}
```

If the execution arguments are:
```bash
node ./dist/index.js watch ./target.png
```

...the `console.log(...)` will prints:
```bash
target -> ./target.png
```

<br />

### Wildcard `"..."`

This wildcard can be used only as the last element of the `"main"` decorator option. This captures all arguments from its current position to the last argument as an `string[]`. Watch this example:
```ts
import { Command, Executable, Argv, ArgvData } from '@bleed-believer/commander';

@Command({
    main: [ 'watch', '...' ],
    name: 'Watch File.'
})
export class WatchCommand implements Executable {
    start(argv: Argv, data: ArgvData): void {
        console.log('targets:');
        for (const file of data.items) {
            console.log('-', file);
        }
    }
}
```

If the execution arguments are:
```bash
node ./dist/index.js watch ./target-01.png ./target-02.png ./target-03.png
```

...the `console.log(...)` will prints:
```bash
targets:
- ./target-01.png
- ./target-02.png
- ./target-03.png
```