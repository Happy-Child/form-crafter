import { ComponentConditionOperator, ComponentsSchemas } from '@form-crafter/core'
import { isEmpty, isNotEmpty } from '@form-crafter/utils'

export const operatorsMock: Record<string, ComponentConditionOperator> = {
    isEmpty: {
        key: 'isEmpty',
        displayName: 'isEmpty',
        execute: ({ properties }) => isEmpty(properties.value),
    },
    isNotEmpty: {
        key: 'isNotEmpty',
        displayName: 'isNotEmpty',
        execute: ({ properties }) => isNotEmpty(properties.value),
    },
}

export const mockComponentsSchemas: ComponentsSchemas = {
    name: {
        meta: { id: 'name', type: 'text-input', name: 'text-input' },
        properties: { value: '' },
    },
    surname: {
        meta: { id: 'surname', type: 'text-input', name: 'text-input' },
        properties: { value: 'text' },
    },
    patronymic: {
        meta: { id: 'patronymic', type: 'text-input', name: 'text-input' },
        properties: { value: '' },
    },
    email: {
        meta: { id: 'email', type: 'text-input', name: 'text-input' },
        visability: { hidden: true },
        properties: { value: '' },
    },
    phone: {
        meta: { id: 'phone', type: 'number-input', name: 'number-input' },
        visability: { hidden: true },
        properties: { value: 123456789 },
    },
}
