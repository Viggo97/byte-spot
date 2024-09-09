export function round(value: number, digits = 0): number {
    return parseFloat(value.toFixed(digits));
}

export function getDigitsNumber(value: number): number {
    return String(value).split('.')[1]?.length || 0;
}
