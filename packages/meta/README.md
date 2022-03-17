# @bleed-believer/meta

Adds metadata easifuly to your objects.


## Installation

Using npm:
```
npm i --save @bleed-believer/meta
```

## How to use

```ts
import { Meta } from '@bleed-believer/meta';

// This is the metadata struct
interface ClassMeta {
    text: string;
    value: number;
}

// This class is the target to assign metadata
class Target {}

// The instance to manage metadata
const CLASSMETA = new Meta<ClassMeta>(
    // Set here a friendly name to the metadata
    'trolled'
);

// Set the metadata value to the target
CLASSMETA.set(Target, {
    text: 'jajaja',
    value: 666
});

// Get the metadata stored in the target
const metaValue = CLASSMETA.get(Target);
console.log(metaValue);

// Check if the target has this metadata with value
const hasMetadata = CLASSMETA.some(Target);
console.log(hasMetadata);
```