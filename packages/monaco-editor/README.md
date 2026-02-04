# @bleed-believer/monaco-editor

## How to use
-   Install the library:
    ```shell
    npm i --save @bleed-believer/monaco-editor
    ```

-   Import the module:
    ```ts
    import { ChangeDetectionStrategy, Component } from '@angular/core';
    import { FormControl, ReactiveFormsModule } from '@angular/forms';
    import { MonacoEditorCtrlModule } from '@bleed-believer/monaco-editor';

    @Component({
        selector: 'app-root',
        templateUrl: './app.html',
        styleUrl: './app.scss',
        changeDetection: ChangeDetectionStrategy.OnPush,
        imports: [
            ReactiveFormsModule,
            MonacoEditorCtrlModule,
        ]
    })
    export class App {
        ctrl = new FormControl('');
    }
    ```

-   Add the component into your template:
    ```html
    <bleed-monaco-editor-ctrl
    language="typescript"
    [formControl]=this.ctrl>
    </bleed-monaco-editor-ctrl>
    ```