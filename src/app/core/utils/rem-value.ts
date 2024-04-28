export function getRemValueInPixels(rem = 1): number {
    return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}
