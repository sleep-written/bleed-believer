# Writting Commands

Commands are the core of this library. Strictly speaking, a command is a class that will be instantiated only if __it's required arguments <u>matches</u> with the execution arguments__, for executes its `start()` method.

## Declaring a command class

To declaring a command class you must implements the `Executable` interface, and use the `@Command` decorator. For example:

```ts
import { Command, Executable } from '@bleed-believer/commander';

@Command({
    path: 'setup',
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
- __"path"__ (`string | string[]`):
    > It's the required arguments to execute this command.
- __"name"__ (`string`):
    > A friendly name to this command.
- __"info"__ (`string`, _optional_):
    > Detailed information about the usage of this command.

<br />

## Getting the `Argv` object

You can get the parsed execution arguments using the `@GetArgv()` decorator. When your class is instanciated, that property will returns an object with the structure of the `Argv` interface ([more details here](./execution-arguments.md#the-argv-interface)). For example:

```ts
import { Command, Executable, Argv, GetArgv } from '@bleed-believer/commander';

@Command({
    path: 'setup',
    name: 'Setup Project.',
    info: 'This command configures your application.'
})
export class SetupCommand implements Executable {
    @GetArgv()
    declare argv: Argv;

    start(): void {
        console.log('This is the setup command!');
        console.log('main args:', this.argv.main);
        console.log('flags:', this.argv.flags);
    }
}
```

## Using wildcards

__If you want to capture data from the _required arguments___, you can use wildcards into the `"path"` options of the `@Command` decorator. To get those captured values, you must add a property of `ArgvData` type, and use the `@GetArgvData()` decorator.

<br />

### Wildcard `":whatever"`

Using `:` with a name, for example `":file"` you can capture the argument at this exact position. All of this wildcards are accesible in the `"param"` key of the `ArgvData` object. Watch this example:
```ts
import { Command, Executable, ArgvData, GetArgvData } from '@bleed-believer/commander';

@Command({
    path: 'watch :file',
    name: 'Watch File.'
})
export class WatchCommand implements Executable {
    @GetArgvData()
    declare data: ArgvData;

    start(): void {
        console.log('target ->', this.data.param.file);
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
import { Command, Executable, ArgvData, GetArgvData } from '@bleed-believer/commander';

@Command({
    path: 'watch ...',
    name: 'Watch File.'
})
export class WatchCommand implements Executable {
    @GetArgvData()
    declare data: ArgvData;

    start(): void {
        console.log('targets:');
        for (const file of this.data.items) {
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