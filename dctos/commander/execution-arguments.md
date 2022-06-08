# Execution arguments

When you launch a __node.js__ program, normally you type in the terminal something like this:

```terminal
node ./dist/index.js main00 main01 --key00 v0 --key01 v01
```

At the whole documentation, all elements involved to execute a node.js program will be referer as <u>__"execution arguments"__</u>. The parts we can identify such:
- __Interpreter__:
    > Is the progran that will execute the code, in this case is `"node"`.
- __Path__:
    > Path of the JS file to execute. In this case is `"./dist/index.js"`.
- __main arguments__:
    > The required arguments that to be sended to the program. In this case is `"main00 main01"`.
- __flags__:
    > Flags are __key/value__ optional arguments that to be sended to the program. In this case is `"--key00 v0 --key01 v01"`.

<hr />

## The `Argv` interface

This library parses the __execution arguments__, returning an object that implements the `Argv` interface. The parsed object contains this properties:

- __"main"__ (`string[]`) - An array with all __required arguments__. Using the above example:
    ```ts
    [ "main00", "main01" ];
    ```
<br />

- __"flags"__ (`Record<string, string[]>`) - An object that contains all __flags__ grouped in a object. The elements with `"-"` at the beginning will be the key, and the elements at the right of will be the value. Using the above example:
    ```ts
    {
        "--key00": [ "v00" ],
        "--key01": [ "v01" ]
    }
    ```
<hr />

## Parsing options

Exists 2 modes to parse the execution arguments: The __"default"__ mode and the __"linear"__ mode. You can set the parsing mode at the `Commander` class instantiation (more details [here](./commander-class.md)).

<br />

### <u>Default mode</u>

This mode adds to the every key __only the value immediately next to it__. The elements next to the first value will be taken as main arguments. For example, see this _execution arguments_:
```bash
node ./dist/index.js arg --key00 aa bb --key00 cc dd --key99 --key01 zz
```

The parsed object will be:
```ts
{
    main: [ "arg", "bb", "dd" ],
    data: {
        "--key00": [ "aa", "cc" ],
        "--key01": [ "zz" ],
        "--key99": []
    }
}
```

### <u>Linear mode</u>

In this mode, __all elements next to a key will be attached to it__. For example, see this _execution arguments_:
```bash
node ./dist/index.js arg --key00 aa bb --key99 --key01 cc dd
```

The parsed object will be:
```ts
{
    main: [ "arg" ],
    opts: {
        "--key00": [ "aa", "bb" ],
        "--key01": [ "cc", "dd" ],
        "--key99": []
    }
}
```