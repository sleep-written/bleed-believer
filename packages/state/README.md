# @bleed-believer/state
A simple state management using only [RxJS](https://rxjs.dev/) to emit changes, orientated to be used in Angular projects. This module includes a variant of `FormGroup` and of `FormArray` to create reactive forms without worring to deal with changes emitted endlessly.

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

## `StateFormGroup` class usage
In certain cases when you work with __Angular__, you may need to use state management in conjunction with __Reactive Forms__. If you have a lot of forms, everyone with a part of the whole state, the control of the value emission could be converted in a painful task. To deal with that, this package includes this class. Escencially, this class extends `FormGroup` class, adding some methods to avoid emit changes when you don't need that.

For example:
-   `test-state.service.ts`
    ```ts
    import { Injectable } from '@angular/core';
    import { State } from '@bleed-believer/state';

    export interface TestState {
        // ... bla bla bla
        // ... bla bla bla

        code: string;
        desc: string;
    }

    export class TestStateService extends State<TestState> {
        constructor() {
            super({
                // ... bla bla bla
                // ... bla bla bla
            });
        }
        
        // ... bla bla bla
        // ... bla bla bla

        setItem(code: string, desc: string): Promise<void> {
            return this.setState(v => {
                return { ...v, code, desc };
            });
        }
    }
    ```

-   `test.component.html`
    ```html
    <form
    [formGroup]="this.form">
        <div>
            <label>Code:</label>
            <input type="text" formControlName="code" />
        </div>
        <div>
            <label>Description:</label>
            <input type="text" formControlName="desc" />
        </div>
    </form>
    ```

-   `test.component.ts`
    ```ts
    import {
        ChangeDetectionStrategy, ChangeDetectorRef, Component,
        OnDestroy, OnInit
    } from '@angular/core';
    import { Subscription } from 'rxjs';
    import { StateFormGroup } from '@bleed-believer/state';

    import { TestState, TestStateService } from './test-state.service';

    @Component({
        selector: 'app-test',
        templateUrl: './test.component.html',
        styleUrls: ['./test.component.scss'],
        changeDetection: ChangeDetectionStrategy.OnPush
    })
    export class TestComponent implements OnInit, OnDestroy {
        #subs: Subscription[];

        // Create the instance here
        form = new StateFormGroup<TestState>({
            code:   ['', Validators.required],
            desc:   ['', Validators.required],
        });

        constructor(
            private _testState: TestStateService,
        ) {}

        ngOnInit(): void {
            this.#subs = [
                // Listens from changes by the user
                this.form
                    .valueChangesByUser
                    .subscribe(this.onFormChanges.bind(this)),
                
                // Listens from changes by the state
                this._testState
                    .state
                    .subscribe(this.onStateChanges.bind(this)),
            ]
        }

        onStateChanges(state: TestState): void {
            // Updates the form data without emit a change
            this.form.setValueSilently({
                code: state.code,
                desc: state.desc
            });
        }

        onFormChanges(): void {
            // Ignores changes emited in "this.onStateChange"
            if (this.form.invalid) { return; }

            // Emit a change
            const { code, desc } = this.form.partialValue;
            this._testServ.setItem(
                code as string,
                desc as string
            );
        }
    }
    ```

## `StateFormArray`

This class extends `FormArray`, with the same utilities given by `StateFormGroup`. When you create the instance, simply declare the structure of all inner forms, and use the methods `setValueSilently` or `patchValueSilently` to rewrite all inner forms (these methods create more forms or delete the leftover forms).

For example:
-   `test-state.service.ts`
    ```ts
    import { Injectable } from '@angular/core';
    import { State } from '@bleed-believer/state';

    export interface TestState {
        code: string;
        desc: string;
    }

    export class TestStateService extends State<TestState[]> {
        constructor() {
            super([]);
        }
        
        // ... bla bla bla
        // ... bla bla bla

        setData(data: TestState[]): Promise<void> {
            return this.setState(() => {
                return TestState.map(x => { ...x });
            });
        }
    }
    ```

-   `test.component.html`
    ```html
    <form
    [formArray]="this.form">
        <table>
            <thead>
                <tr>
                    <th>Code</th>
                    <th>Description</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr *ngFor="let form of this.form.controls; let i = index"
                [formGroup]="form">
                    <td>
                        <input type="text" formControlName="code" />
                    </td>
                    <td>
                        <input type="text" formControlName="desc" />
                    </td>
                    <td>
                        <button
                        type="button"
                        (click)="this.form.createAt(i)">
                            <span>Create at</span>
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
    </form>
    ```

-   `test.component.ts`
    ```ts
    import {
        ChangeDetectionStrategy, ChangeDetectorRef, Component,
        OnDestroy, OnInit
    } from '@angular/core';
    import { Subscription } from 'rxjs';
    import { StateFormArray } from '@bleed-believer/state';

    import { TestState, TestStateService } from './test-state.service';

    @Component({
        selector: 'app-test',
        templateUrl: './test.component.html',
        styleUrls: ['./test.component.scss'],
        changeDetection: ChangeDetectionStrategy.OnPush
    })
    export class TestComponent implements OnInit, OnDestroy {
        #subs: Subscription[];

        // Create the instance here
        form = new StateFormArray<TestState>({
            code:   ['', Validators.required],
            desc:   ['', Validators.required],
        });

        constructor(
            private _testState: TestStateService,
        ) {}

        ngOnInit(): void {
            this.#subs = [
                // Listens from changes by the user
                this.form
                    .valueChangesByUser
                    .subscribe(this.onFormChanges.bind(this)),
                
                // Listens from changes by the state
                this._testState
                    .state
                    .subscribe(this.onStateChanges.bind(this)),
            ]
        }

        onStateChanges(state: TestState[]): void {
            // Updates the form data without emit a change
            this.form.setValueSilently(state);
        }

        onFormChanges(): void {
            // Ignores changes emited in "this.onStateChange"
            if (this.form.invalid) { return; }

            // Emit a change
            const data = this.form.partialValue;
            this._testServ.setData(data);
        }
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