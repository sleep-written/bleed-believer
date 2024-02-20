/**
 * The type of the Grid pager.
 *
 * The available values are:
 * * `numeric`&mdash;Buttons with numbers.
 * * `input`&mdash;Input for typing the page number.
 *
 * @example
 * ```html
 * <kendo-grid [pageable]="{ type: 'numeric' }">
 *   <kendo-grid-column field="ProductID"></kendo-grid-column>
 *   ...
 * </kendo-grid>
 * ```
 */
export declare type PagerType = 'numeric' | 'input';
/**
 * The position of the Grid pager.
 *
 * The available values are:
 * * `top`&mdash;The pager is rendered above the Grid headers.
 * * `bottom`&mdash;(Default) The pager is rendered below the data table.
 * * `both`&mdash;Two pagers are rendered - one above the Grid headers, and one - below the data table.
 *
 * @example
 * ```html
 * <kendo-grid [pageable]="{ position: 'both' }">
 *   <kendo-grid-column field="ProductID"></kendo-grid-column>
 *   ...
 * </kendo-grid>
 * ```
 */
export declare type PagerPosition = 'top' | 'bottom' | 'both';
/**
 * The pager settings of the Grid ([see example](slug:paging_grid_settings)).
 */
export interface PagerSettings {
    /**
     * Sets the maximum numeric buttons count before the buttons are collapsed.
     */
    buttonCount?: number;
    /**
     * Toggles the information about the current page and the total number of records.
     */
    info?: boolean;
    /**
     * Defines the type of the Grid pager.
     */
    type?: PagerType;
    /**
     * Shows a menu for selecting the page size.
     */
    pageSizes?: boolean | Array<number>;
    /**
     * Toggles the **Previous** and **Next** buttons.
     */
    previousNext?: boolean;
    /**
     * Toggles the built-in responsive behavior of the Pager.
     * Available in version `5.0.0` and above ([see example]({% slug paging_grid %}#toc-responsive-pager)).
     */
    responsive?: boolean;
    /**
     * Defines the Pager position relative to the Grid data table.
     * The possible values are 'top', 'bottom', and 'both' ([see example]({% slug paging_grid %}#toc-pager-settings)).
     */
    position?: PagerPosition;
}