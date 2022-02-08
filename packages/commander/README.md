# @bleed-believer/commander

A package to create CLI applications.

## Creating a __command__
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

## Command __templates__

To declare a command, do you need to define its main template. The template is a string that the library try to match with the arguments given by the user. For example:

```bash
# Template
test command

# Valid user input examples
node ./dist test command
```

### Wildcard `":"`
Use this for receive any value, for example:
```bash
# Template
cp :input :output

# Valid user input examples
node ./dist cp ./file-a.txt ./file-b.txt
node ./dist cp ./aaaa.mp3 ./bbbb.mp3
```
