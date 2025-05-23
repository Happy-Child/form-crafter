import { ComponentsSchemas } from '@form-crafter/core'

export const mockComponentSchema: ComponentsSchemas = {
    'input-last-name': {
        meta: { id: 'input-last-name', type: 'editable', name: 'text-field' },
        properties: { label: 'Фамилия', value: '' },
        relations: {
            options: [
                {
                    id: 'id1',
                    ruleName: 'duplicateValue',
                    options: { duplicateValueComponentId: 'input-first-name' },
                },
                {
                    id: 'id2',
                    ruleName: 'hidden',
                    condition: { type: 'component', componentId: 'input-salary', operatorName: 'isNotEmpty' },
                },
            ],
        },
    },
    email: {
        meta: { id: 'email', type: 'editable', name: 'email' },
        properties: { label: 'Email', value: undefined },
        relations: {
            options: [
                {
                    id: 'id3',
                    ruleName: 'hidden',
                    condition: {
                        type: 'operator',
                        operator: 'and',
                        operands: [
                            { type: 'component', componentId: 'input-first-name', operatorName: 'isEmpty' },
                            { type: 'component', componentId: 'date-birth', operatorName: 'beforeDate', options: { date: '01-01-2000' } },
                        ],
                    },
                },
            ],
        },
    },
    'select-department': {
        meta: { id: 'select-department', type: 'editable', name: 'select' },
        properties: {
            value: undefined,
            label: 'Отдел',
            options: [
                { label: 'Разработка', value: 'dev' },
                { label: 'Маркетинг', value: 'marketing' },
                { label: 'Продажи', value: 'sales' },
            ],
        },
        relations: {
            options: [
                {
                    id: 'id4',
                    ruleName: 'changeSelectOptions',
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
                            { type: 'component', componentId: 'input-first-name', operatorName: 'startsWith', options: { startsWith: 'egor' } },
                            { type: 'component', componentId: 'input-last-name', operatorName: 'startsWith', options: { startsWith: 'lazuka' } },
                        ],
                    },
                },
            ],
        },
    },
}
