/**
 * Arguments for the `pageChange` event.
 */
export interface PageChangeEvent {
    /**
     * The number of records to skip.
     */
    skip: number;
    /**
     * The number of records to take.
     */
    take: number;
}