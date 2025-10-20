import { EntityId } from '@form-crafter/core'
import { AvailableObject, AvailableValue, isArray, isNotEmpty, isObject, isString } from '@form-crafter/utils'

// TODO impl warn if not found value by path, if value is not string type, if value by key not exists
export const extractValuesByDepsPaths = (targetObj: AvailableObject, paths: string[][]): Set<EntityId> => {
    const values = new Set<EntityId>()

    const extractValues = (value: AvailableValue, path: string[], currentIndex: number) => {
        if (isString(value) && currentIndex === path.length) {
            values.add(value)
            return
        }

        if (isArray(value)) {
            value.forEach((item) => {
                extractValues(item, path, currentIndex)
            })
        } else if (isObject(value)) {
            const key = path[currentIndex]
            const nextValue = value?.[key]

            if (!isNotEmpty(nextValue)) {
                return
            }

            extractValues(nextValue, path, currentIndex + 1)
        }
    }

    paths.forEach((path) => {
        extractValues(targetObj, path, 0)
    })

    return values
}
