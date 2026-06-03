export function stringArraysEqual(a: string[] = [], b: string[] = []): boolean {
    const set1 = new Set(a);
    const set2 = new Set(b);

    if (set1.size !== set2.size) {
        return false;
    }

    for (const value of set1) {
        if (!set2.has(value)) {
            return false;
        }
    }

    return true;
}
