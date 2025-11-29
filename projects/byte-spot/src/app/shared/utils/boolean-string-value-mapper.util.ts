import { ValueOf } from '@app/shared/utils/value-of.type';

export function booleanStringValueMapper<TMap extends Record<string, string>>(
    map: TMap, value: { [Property in keyof TMap]: boolean}): ValueOf<TMap>[] {
    return Object.keys(value)
        .filter(key => value[key])
        .map(key => map[key]) as ValueOf<TMap>[];
}
