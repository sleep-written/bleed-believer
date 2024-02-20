/**
 * Specifies a modifier key when multiple sort. [See example](slug:multi_sort_grid#toc-sort-key-modifier).
 *
 * @example
 * ```html
 * <kendo-grid [sortable]="{ mode: 'multiple', multiSortKey: 'shift' }">
 *   <kendo-grid-column field="ProductID"></kendo-grid-column>
 *   ...
 * </kendo-grid>
 * ```
 */
export declare type ModifierKey = 'none' | 'ctrl' | 'shift' | 'alt';