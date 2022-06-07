export type TypedPropertyDecorator<T> =
<
    K extends   string | symbol,
    O extends   { [KK in K]: T; }
>
(
    target: O,
    key: K,
) => void;