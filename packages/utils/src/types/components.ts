export type AvailableValue = string | number | boolean | null | undefined | File | FileList | AvailableValue[] | AvailableObject

export type AvailableObject = { [key: string]: AvailableValue }
