export const getIntersectionsItems = <A extends unknown[], B extends unknown[]>(a: A, b: B): (A[number] & B[number])[] => {
    const bSet = new Set(b)
    return a.filter((item) => bSet.has(item as any))
}
