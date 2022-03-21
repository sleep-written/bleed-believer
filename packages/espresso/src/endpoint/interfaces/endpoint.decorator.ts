import { Controller } from '../../controller';

export type EndpointDecorator = (
    target: Controller,
    key: string | symbol,
    descriptor:
        TypedPropertyDescriptor<() => Promise<void>> |
        TypedPropertyDescriptor<() => void>
) => void