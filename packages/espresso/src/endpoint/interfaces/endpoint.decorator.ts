import type { Controller } from '../../controller/index.js';

export type EndpointDecorator = (
    target: Controller,
    key: string | symbol,
    descriptor:
        TypedPropertyDescriptor<() => Promise<void>> |
        TypedPropertyDescriptor<() => void>
) => void