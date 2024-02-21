/**
 * Represents a structured response format for grid views, encapsulating both
 * the array of data items and the total count of items across all pages. This
 * interface is designed to seamlessly integrate with front-end tables, particularly
 * with `@progress/kendo-angular-grid`, by providing the necessary data bindings
 * for efficient pagination and display. It is part of the `@bleed-believer/kendo-grid-client`
 * library, which facilitates quick and structured bindings for creating tables,
 * and leverages a simplified version of the OData protocol to interact with the
 * corresponding backend service `@bleed-believer/kendo-grid-server`.
 *
 * @typeParam T - The type of the data items contained in the grid. This type
 * extends `Record<string, any>`, allowing for a wide range of fields and data types
 * to be represented within the grid items.
 */
export interface GridView<T extends Record<string, any>> {
    /**
     * An array of data items of type `T` representing the rows to be displayed
     * in the grid. Each item corresponds to one row in the grid view.
     */
    data: T[];

    /**
     * The total number of items available across all pages. This is used to
     * calculate pagination and inform the user about the total amount of data
     * accessible through the grid.
     */
    total: number;
}
