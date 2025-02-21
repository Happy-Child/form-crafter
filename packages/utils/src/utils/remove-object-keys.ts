export const removeObjectKeys = <T extends Record<string, unknown>>(obj: T, keys: (keyof T)[]) => {
    const finalObj = { ...obj }

    keys.forEach((key) => {
        delete finalObj[key]
    })

    return finalObj
}
