import type { ModifierKey } from './modifier-key.js';

export type SortSettings = SingleSortSettings | MultipleSortSettings;

/**
 * Defines the settings for sorting the Grid column.
 */
export interface ColumnSortSettings {
    /**
     * Enables the removal of the column sorting.
     */
    allowUnsort?: boolean;
    /**
     * Determines the initial (from the unsorted to the sorted state) sort direction.
     *
     * The available values for setting the initial sort direction.
     */
    initialDirection?: 'asc' | 'desc';
}

/**
 * Specifies settings for sorting by single column.
 */
export interface SingleSortSettings extends ColumnSortSettings {
    /**
     * The sort mode of the Grid.
     */
    mode?: 'single';
}

/**
 * Specifies settings for sorting by multiple columns. [See example](slug:multi_sort_grid).
 */
export interface MultipleSortSettings extends ColumnSortSettings {
    /**
     * The sort mode of the Grid.
     */
    mode: 'multiple';
    /**
     * Enables the sort-sequence indicators for sorting multiple columns.
     */
    showIndexes?: boolean;
    /**
     * Specifies the modifier key for sorting by 2nd or more columns.
     *
     * By default, clicking a column adds it to the sort order (corresponds to `'none'`).
     * Selecting a key modifier along with the click will remove sorting from all other columns.
     *
     * If the key is set to 'ctrl', 'shift' or 'alt', clicking a column will remove sorting from all other columns.
     * The specified key must be pressed to add the column to the sort order instead.
     * The `ctrl` value corresponds to the `Command` key in a macOS environment. [See example](slug:multi_sort_grid#toc-sort-key-modifier).
     *
     */
    multiSortKey?: ModifierKey;
}