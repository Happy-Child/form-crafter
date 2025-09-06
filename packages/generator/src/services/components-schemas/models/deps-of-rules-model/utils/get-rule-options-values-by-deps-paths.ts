import { EntityId } from '@form-crafter/core'
import { AvailableObject, AvailableValue, isArray, isNotEmpty, isObject, isString } from '@form-crafter/utils'

export const getRuleOptionsValuesByDepsPaths = (targetObj: AvailableObject, paths: string[][]): EntityId[] => {
    const values: EntityId[] = []

    const extractValues = (value: AvailableValue, path: string[], currentIndex: number) => {
        if (currentIndex === path.length) {
            if (isString(value)) {
                values.push(value)
            }
            return
        }

        const key = path[currentIndex]
        const nextValue = isObject(value) && !isArray(value) ? value?.[key] : undefined

        if (!isNotEmpty(nextValue)) {
            return
        }

        if (isArray(nextValue)) {
            nextValue.forEach((item) => {
                if (isString(item)) {
                    values.push(item)
                    return
                }
                extractValues(item, path, currentIndex + 1)
            })
        } else {
            extractValues(nextValue, path, currentIndex + 1)
        }
    }

    paths.forEach((path) => {
        extractValues(targetObj, path, 0)
    })

    return values
}
