import { Maybe } from '../types'

export const isNull = <T>(value: T | null): value is null => {
    return value === null
}

export const isUndefined = <T>(value: T | undefined): value is undefined => {
    return value === undefined
}

export const isNotNull = <T>(value: T | null): value is T => {
    return !isNull(value)
}

export const isNotUndefined = <T>(value: T | undefined): value is T => {
    return !isUndefined(value)
}

export const isString = (value: unknown): value is string => {
    return typeof value === 'string'
}

export const isArray = <T>(value: unknown): value is T[] => {
    return Array.isArray(value)
}

export const isNumber = (value: unknown): value is number => {
    if (typeof value === 'number') {
        return !Number.isNaN(value) && Number.isFinite(value)
    }
    return false
}

export const isEmpty = <T>(value: Maybe<T>): value is Maybe<T> => {
    if (isNull(value) || isUndefined(value)) {
        return true
    }
    if (isString(value) || isArray(value)) {
        return value.length === 0
    }
    if (typeof value === 'object') {
        return Object.keys(value as object).length === 0
    }
    return false
}

export const isNotEmpty = <T>(value: Maybe<T>): value is T => {
    return !isEmpty(value)
}

export const isFunction = (val: unknown): val is Function => typeof val === 'function'
