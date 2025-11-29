export type Exact<T, U> = U extends T
    ? Exclude<keyof U, keyof T> extends never
        ? U
        : never
    : never;
