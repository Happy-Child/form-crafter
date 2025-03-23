import { ComponentType } from '../types'

export type GeneralComponentOperator = {
    name: string
    displayName: string
    helpText?: string
    execute: () => boolean
    renderValue: any
}

export type EditableComponentOperator = {
    name: string
}

export type RepeaterComponentOperator = {
    name: string
}

export type UploaderComponentOperator = {
    name: string
}

type AllowComponentType = Extract<ComponentType, 'editable' | 'repeater' | 'uploader'>

export type ComponentOperator<T extends AllowComponentType = never> = T extends 'editable'
    ? EditableComponentOperator
    : T extends 'repeater'
      ? RepeaterComponentOperator
      : T extends 'uploader'
        ? UploaderComponentOperator
        : GeneralComponentOperator
