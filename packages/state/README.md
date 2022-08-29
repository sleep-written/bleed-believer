# @bleed-believer/state
A simple state management using only [RxJS](https://rxjs.dev/) to emit changes. This module only exports 2 classes, for the most common operations, you may only need to use `State` class. Otherwise if you need to implement a custom async FIFO you could check the `Serial` class instead.

## Installation
Just execute this command in your terminal:
```bash
npm i --save @bleed-believer/state
```

## `State` class usage
To explain how to use this class, we will implement the following example: You have a counter, and a flag to check if the counter is locked or not. The interface of the counter is the following:
```ts
// counter.ts
export interface Counter {
  count:  number;
  locked: boolean;
}
```

So, the next part is create a class extending the `State` class (passing the state model as type parameter) with the methods that modify your state:
```ts
// counter.state.ts
import { State } from '@bleed-believer/state';
import { Counter } from './counter.ts';

export class CounterState extends State<Counter> {
    constructor() {
        // Sets the initial value
        super({
            count: 0,
            locked: false
        });
    }

    // This method adds +1 to the current counter value
    addOne(): Promise<void> {
        return this.setState(input => {
            if (input.locked) {
                return input;
            } else {
                const count = ++input.count;
                return {
                    ...input,
                    count
                };
            }
        });
    }

    // Locks or unlocks the current counter
    setLockState(locked: boolean): Promise<void> {
        return this.setState(input => ({
            ...input,
            locked
        }));
    }

    // Resets the current counter
    reset(): Promise<void> {
        return this.setState(input => ({
            count: 0,
            locked: false
        }));
    }
}
```

Finally, create a new instance in your component. To read the current state of your instance, you have a property called `state`, is a `BehaviorSubject<T>`. Every changes made with your methods declared previously in your `State` class, emits a new value:
```ts
// counter.component.ts
import { Component } from '@angular/core';
import { CounterState } from './counter.state';

@Component({
  selector: 'app-counter',
  styleUrls: ['./counter.component.scss'],
  template: `
    <h2>{{ (this.counter.state | async)?.count }}</h2>

    <button
    (click)="this.counter.addOne()">
        <span>+1</span>
    </button>

    <button
    (click)="this.counter.setLockState(true)"
    [disabled]="(this.counter.state | async)?.locked">
        <span>Lock</span>
    </button>

    <button
    (click)="this.counter.setLockState(false)"
    [disabled]="!(this.counter.state | async)?.locked">
        <span>Unlock</span>
    </button>

    <button
    (click)="this.counter.reset()">
        <span>Reset</span>
    </button>
  `
})
export class ContrVentaComponent {
  counter = new CounterState();
}

```

## `Serial` class usage
In certain cases, you may need to implement a method that you need a certainty that will __be called only once__, even if is called while the first call still in progress. So for those cases exist the  `Serial` class.

There's an example:
```ts
import { Serial } from '@bleed-believer/state';

export class Dummy {
    static #serial = new Serial();

    someSerialMethod(): Promise<void> {
        return Dummy.#serial.push(async () => {
            console.log('Method started');
            // An irrelevant process that takes
            // 5 segs to be completed...
            console.log('Method ended');
        });
    }
}
```
Using the class of above, if you make this...
```ts
const dummy = new Dummy();

console.log('Begin calls');
dummy.someSerialMethod();   // 1st call launched in paralell
dummy.someSerialMethod();   // 2nd call launched in paralell
dummy.someSerialMethod();   // 3rd call launched in paralell
console.log('End calls');
```
...the `Serial` instance will add the `someSerialMethod` in a queue. Executes the first elemen in the queue, and waits the call end or fail before to execute the next in queue. Taking the code of above and the example class, the text printed in terminal will be:
```bash
Begin calls     # Before to call the `someSerialMethod` three times
EndCalls        # After to make the three calls of `someSerialMethod`

Method started  # 1st call initialized
Method ended    # 1st call ended after 5 segs

Method started  # 2nd call initialized
Method ended    # 2nd call ended after 5 segs

Method started  # 3rd call initialized
Method ended    # 3rd call ended after 5 segs
```

An alternative approach could be, for example, a case when you need that you process will be launched only when the queue is empty. To implement a case like that, you can made something like this:
```ts
export class Pulsar {
    static #serial = new Serial();

    onClick(): Promise<void> {
        if (Pulsar.#serial.isBusy) {
            // Doesn't execute the process because
            // the serial instance is busy
            return Promise.resolve();
        }

        return Pulsar.#serial.push(async () => {
            // An irrelevant process that takes
            // 5 segs to be completed...
        });
    }
}
```

With that example, the process will be executed only when the `Serial` instance is free. If the process is running, no matter how many times do you press the button, the process won't be launched. When the first call is ended, the Serial instance __will be available to receipt the next call.__