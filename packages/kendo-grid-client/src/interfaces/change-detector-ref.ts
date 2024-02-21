/**
 * Provides a direct reference to Angular's `ChangeDetectorRef`, highlighting
 * the specific interaction with the `detectChanges()` method within the context
 * of this library. This interface is designed to ensure compatibility and ease
 * of integration with Angular's change detection mechanism, allowing for manual
 * triggering of change detection cycles in components that utilize this library.
 * The sole focus on the `detectChanges()` method underlines its critical role in
 * managing dynamic updates to the UI, particularly in response to data changes
 * that may not automatically trigger Angular's change detection.
 */
export interface ChangeDetectorRef {
    /**
     * Manually triggers Angular's change detection process, ensuring that changes
     * to data are reflected in the UI. This method is essential for scenarios where
     * updates occur outside Angular's automatic detection mechanisms, providing
     * developers with precise control over when and how changes are reflected in
     * the application's view.
     */
    detectChanges(): void;
}
