# @bleed-believer/commander

A package to create CLI applications.

##  1. <a name='Tableofcontents:'></a>Table of contents:

<!-- vscode-markdown-toc -->
* 1. [Table of contents:](#Tableofcontents:)
* 2. [Creating a __command__](#Creatinga__command__)
* 3. [Command __template__](#Command__template__)
	* 3.1. [Wildcard `":"`](#Wildcard:)
	* 3.2. [Wildcard `"..."`](#Wildcard...)
* 4. [Reading user arguments](#Readinguserarguments)
* 5. [Command Routing](#CommandRouting)

<!-- vscode-markdown-toc-config
	numbering=true
	autoSave=true
	/vscode-markdown-toc-config -->
<!-- /vscode-markdown-toc -->

##  2. <a name='Creatinga__command__'></a>Creating a __command__

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

##  3. <a name='Command__template__'></a>Command __template__

To declare a command, do you need to define its main template. The template is a string that the library try to match with the arguments given by the user. For example:

```bash
# Template
test command

# Valid user input examples
node ./dist test command
```

###  3.1. <a name='Wildcard:'></a>Wildcard `":"`

Use this for receive any value, for example:

```bash
# Template
cp :input :output

# Valid user input examples
node ./dist cp ./file-a.txt ./file-b.txt
node ./dist cp ./aaaa.mp3 ./bbbb.mp3
```

###  3.2. <a name='Wildcard...'></a>Wildcard `"..."`

Use it in the last item if you want to capture an array with all items from this point towards the end. For example:

```bash
# Template
capture ...items

# Valid user input examples
node ./dist capture
node ./dist capture lol
node ./dist capture jajajajajajaj xDDDDDDdddddd
node ./dist capture ./server.json ./client.json ./database.json
```

##  4. <a name='Readinguserarguments'></a>Reading user arguments

Imagine do you want to make a command with this pattern:

```
test :name ...actions
```

And the user executes your program with this arguments:

```
node ./dist test hello-world copy delete --verbose true --interactive false
```

If you want the access to the arguments given by the user:

```ts
import { Command, Executable, Argv, ArgvData } from '@bleed-believer/commander';

@Command({
    main: 'test :name ...actions',
    name: 'Test Command'
})
export class TestCommand implements Executable {
    start(argv: Argv, data: ArgvData): void {
        console.log(argv.main);
        // Prints [ 'test', 'hello-world', 'copy', 'delete' ];

        console.log(argv.args);
        // Prints { '--verbose': [ 'true' ], '--interactive': [ 'false' ] };

        console.log(data.param);
        // Prints { 'name': 'hello-world' };

        console.log(data.items);
        // Prints [ 'copy', 'delete' ];
    }
}
```

##  5. <a name='CommandRouting'></a>Command Routing

A command route it's a class that stores commands, or another routes. Check these files:

`./commamnds/setup.command.ts`:
```ts
import { Command, Executable } from '@bleed-believer/commander';

@Command({
    main: 'setup',
    name: 'Setup Project'
})
export class SetupCommand implements Executable {
    start(): void {
        // Bla bla bla bla
    }
}
```

`./commamnds/test.command.ts`:
```ts
import { Command, Executable } from '@bleed-believer/commander';

@Command({
    main: 'test',
    name: 'Setup Project'
})
export class SetupCommand implements Executable {
    start(): void {
        // Bla bla bla bla
    }
}
```
