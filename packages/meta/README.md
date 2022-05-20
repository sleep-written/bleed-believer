# @bleed-believer/meta

Adds metadata easifuly to your objects. Now this package works in ESM projects and CommonJS too.

## Installation

Use npm to get the last version:
```bash
npm i --save @bleed-believer/meta
```

<br />

## Concepts

To understand how this library works, first we need to define some concepts:

### _Target:_

Any object that you want to write inside of, data about itself. It's common, for example, have classes that you need to specify how those classes will be instantiated and used for a particular third party tool or library. So in thoses cases you may need to write data dinamically into the class definition.

### _Metadata:_

The data do you want to attach to the target. This data normally describes how to use the target to another object that requires for it. 

<br />

## How to use