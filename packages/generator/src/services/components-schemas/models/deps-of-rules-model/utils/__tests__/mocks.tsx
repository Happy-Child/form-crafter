import { ComponentsSchemas } from '@form-crafter/core'

export const mockComponentSchema: ComponentsSchemas = {
    'input-last-name': {
        meta: { id: 'input-last-name', type: 'text-input', name: 'text-field' },
        properties: { label: 'Фамилия', value: '' },
        mutations: {
            schemas: [
                {
                    id: 'id1',
                    key: 'duplicateValue',
                    options: { duplicateValueComponentId: 'input-first-name' },
                },
                {
                    id: 'id2',
                    key: 'hidden',
                    condition: { type: 'component', componentId: 'input-salary', operatorKey: 'isNotEmpty' },
                },
            ],
        },
    },
    email: {
        meta: { id: 'email', type: 'text-input', name: 'email' },
        properties: { label: 'Email', value: undefined },
        mutations: {
            schemas: [
                {
                    id: 'id3',
                    key: 'hidden',
                    condition: {
                        type: 'operator',
                        operator: 'and',
                        operands: [
                            { type: 'component', componentId: 'input-first-name', operatorKey: 'isEmpty' },
                            { type: 'component', componentId: 'date-birth', operatorKey: 'beforeDate', options: { date: '01-01-2000' } },
                        ],
                    },
                },
            ],
        },
    },
    'select-department': {
        meta: { id: 'select-department', type: 'select', name: 'select' },
        properties: {
            value: undefined,
            label: 'Отдел',
            options: [
                { label: 'Разработка', value: 'dev' },
                { label: 'Маркетинг', value: 'marketing' },
                { label: 'Продажи', value: 'sales' },
            ],
        },
        mutations: {
            schemas: [
                {
                    id: 'id4',
                    key: 'changeSelectOptions',
                    options: {
                        topComponentId: 'input-salary',
                        example: {
                            componentId: 'input-position',
                        },
                    },
                    condition: {
                        type: 'operator',
                        operator: 'or',
                        operands: [
                            { type: 'component', componentId: 'input-first-name', operatorKey: 'startsWith', options: { startsWith: 'egor' } },
                            { type: 'component', componentId: 'input-last-name', operatorKey: 'startsWith', options: { startsWith: 'lazuka' } },
                        ],
                    },
                },
            ],
        },
    },
}
