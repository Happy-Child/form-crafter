import { isFile, isFilesList, isObject } from '@form-crafter/utils'
import { isEqual } from 'lodash-es'

const areFilesEqual = (a: File, b: File): boolean => {
    return a.name === b.name && a.size === b.size && a.type === b.type && a.lastModified === b.lastModified
}

const areFileArraysEqual = (a: File[], b: File[]): boolean => {
    if (a.length !== b.length) {
        return false
    }
    return a.every((file, index) => areFilesEqual(file, b[index]))
}

export const isChangedValue = (oldValue: unknown, newValue: unknown): boolean => {
    if (isFile(oldValue) && isFile(newValue)) {
        return !areFilesEqual(oldValue, newValue)
    }

    if (isFilesList(oldValue) && isFilesList(newValue)) {
        return !areFileArraysEqual(oldValue, newValue)
    }

    if (isObject(oldValue) && isObject(newValue)) {
        for (const key in oldValue) {
            const a = oldValue[key]
            const b = newValue[key]

            if (isFile(a) && isFile(b)) {
                return !areFilesEqual(a, b)
            }
            if (isFilesList(a) && isFilesList(b)) {
                return !areFileArraysEqual(a, b)
            }
            if (!isEqual(a, newValue[key])) {
                return true
            }
        }

        return false
    }

    return !isEqual(oldValue, newValue)
}
