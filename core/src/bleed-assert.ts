import { assert } from 'chai';

export const bleedAssert = new class {
    async throwsAsync<T = any>(
        action: () => T | Promise<T>,
        ref?: new () => Error,
        message?: string
    ): Promise<void> {
        try {
            await action();
            assert.throws(null);
        } catch (fail) {
            assert.throws(() => { throw fail; }, ref, message);
        }
    }

    async doesNotThrowAsync<T = any>(
        action: () => T | Promise<T>,
        message?: string
    ): Promise<void> {
        try {
            await action();
            assert.doesNotThrow(() => {});
        } catch (fail) {
            assert.doesNotThrow(() => { throw fail; }, message);
        }
    }
}
