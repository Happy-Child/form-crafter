export const getIntersectionsKeys = <A extends Record<string, unknown>, B extends Record<string, unknown>>(a: A, b: B): (keyof A & keyof B)[] => {
    const keysA = Object.keys(a)
    const keysB = new Set(Object.keys(b))
    return keysA.filter((key) => keysB.has(key))
}
