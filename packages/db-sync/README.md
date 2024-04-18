# @bleed-believer/db-sync

## Unit testing
-   Install dependencies (in main monorepo folder):
    ```shell
    npm ci --peer
    ```

-   Go to this folder, and create the fake databases:
    ```shell
    cd ./packages/db-sync
    npm run setup
    ```

-   Now run the unit tests:
    ```shell
    npm run test
    ```

## Test the library
-   Install dependencies (in main monorepo folder):
    ```shell
    npm ci --peer
    ```

-   Go to this folder, and create the fake databases:
    ```shell
    cd ./packages/db-sync
    npm run setup
    ```

-   Now run the process:
    ```shell
    npm run start
    ```