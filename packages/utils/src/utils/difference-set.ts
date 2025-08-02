export const differenceSet = <T>(a: Set<T>, b: Set<T>) => {
    const result = new Set(a)

    for (const value of b) {
        result.delete(value)
    }

    return result
}
