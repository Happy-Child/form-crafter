import { isFile } from './is-file'
import { isArray } from './type-checking'

export const isFilesList = (value: unknown): value is File[] => isArray(value) && isFile(value[0])
