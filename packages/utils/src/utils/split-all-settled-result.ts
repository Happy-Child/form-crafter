export const splitAllSettledResult = async <S, E>(promises: Promise<S>[]): Promise<[S[], E[]]> => {
    const result = await Promise.allSettled(promises)

    const [resolved, rejected] = result.reduce<[S[], E[]]>(
        (result, resultItem) => {
            if (resultItem.status === 'fulfilled') {
                result[0].push(resultItem.value)
            } else {
                result[1].push(resultItem.reason as E)
            }
            return result
        },
        [[], []],
    )

    return [resolved, rejected]
}
