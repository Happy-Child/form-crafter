import { ComponentType } from '../types'

export type GeneralConditionOperator = {
    name: string
    execute: () => boolean
}

export type EditableConditionOperator = {
    name: string
}

export type RepeaterConditionOperator = {
    name: string
}

export type UploaderConditionOperator = {
    name: string
}

type AllowComponentType = Extract<ComponentType, 'editable' | 'repeater' | 'uploader'>

export type ConditionOperator<T extends AllowComponentType = never> = T extends 'editable'
    ? EditableConditionOperator
    : T extends 'repeater'
      ? RepeaterConditionOperator
      : T extends 'uploader'
        ? UploaderConditionOperator
        : GeneralConditionOperator
