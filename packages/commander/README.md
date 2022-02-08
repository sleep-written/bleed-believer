# @bleed-believer/commander

A package to create CLI applications.

## Command

A command is a class that will be instanciated by the `Commander` instance when the arguments passed to the execution matches with the pattern declaren in the key `"main"`. If this class is found by the `Commander` instance, then an instance of the command class will be created, and the method `this.start(...)` will be called.

```ts
import { Command, Executable, Argv, ArgvData } from '@bleed-believer/commander';

@Command({
    // The arguments pattern of this command.
    main: 'test',

    // A friendly name for this command.
    name: 'Test Project'
})
export class TestCommand implements Executable {
    // If this command is found, this method will be launched
    start(argv: Argv, data: ArgvData): void {
        console.log('This is the test command!');
    }
}
```