import { OptionalSerializableObject } from '../types'
import { isObject } from './type-checking'

export const isOptionalSerializableObject = (value: unknown): value is OptionalSerializableObject => isObject(value)
