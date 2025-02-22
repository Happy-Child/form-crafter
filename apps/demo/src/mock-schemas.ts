import { rootComponentId, Schema } from '@form-crafter/core'

export const employeeFormSchema: Schema = {
    id: 'employee-form',
    version: '1.0',
    layout: {
        colsSpanPx: { default: 24 },
        rowsSpanPx: { default: 36 },
    },
    views: {
        initialViewId: 'main-view',
        definitions: {
            'main-view': {
                rows: {
                    row_id_1: {
                        id: 'row_id_1',
                        children: [{ id: 'input-first-name' }, { id: 'input-last-name' }],
                    },
                    row_id_2: {
                        id: 'row_id_2',
                        children: [{ id: 'date-birth' }, { id: 'email' }],
                    },
                    row_id_3: {
                        id: 'row_id_3',
                        children: [{ id: 'input-salary' }],
                    },
                    row_id_4: {
                        id: 'row_id_4',
                        children: [{ id: 'group-work' }],
                    },
                    row_id_5: {
                        id: 'row_id_5',
                        children: [{ id: 'contacts' }],
                    },
                    'group-work_1': {
                        id: 'row_id_5',
                        children: [{ id: 'input-position' }, { id: 'select-department' }],
                    },
                    'group-work_2': {
                        id: 'row_id_5',
                        children: [{ id: 'date-start' }],
                    },
                },
                components: {
                    [rootComponentId]: {
                        id: rootComponentId,
                        rows: [
                            {
                                id: 'row_id_1',
                            },
                            {
                                id: 'row_id_2',
                            },
                            {
                                id: 'row_id_3',
                            },
                            {
                                id: 'row_id_4',
                            },
                            {
                                id: 'row_id_5',
                            },
                        ],
                    },
                    'input-first-name': {
                        id: 'input-first-name',
                        parentId: rootComponentId,
                        params: {
                            layout: { col: { default: 12 } },
                        },
                    },
                    'input-last-name': {
                        id: 'input-last-name',
                        parentId: rootComponentId,
                        params: {
                            layout: { col: { default: 12 } },
                        },
                    },
                    'date-birth': {
                        id: 'date-birth',
                        parentId: rootComponentId,
                        params: {
                            layout: { col: { default: 'auto' } },
                        },
                    },
                    email: {
                        id: 'email',
                        parentId: rootComponentId,
                        params: {
                            layout: { col: { default: 19 } },
                        },
                    },
                    'input-salary': {
                        id: 'input-salary',
                        parentId: rootComponentId,
                        params: {
                            layout: { col: { default: 12 } },
                        },
                    },
                    'group-work': {
                        id: 'group-work',
                        parentId: rootComponentId,
                        params: {
                            layout: { col: { default: 24 } },
                        },
                        rows: [{ id: 'group-work_1' }, { id: 'group-work_2' }],
                    },
                    'input-position': {
                        id: 'input-position',
                        parentId: 'group-work',
                        params: {
                            layout: { col: { default: 12 } },
                        },
                    },
                    'select-department': {
                        id: 'select-department',
                        parentId: 'group-work',
                        params: {
                            layout: { col: { default: 12 } },
                        },
                    },
                    'date-start': {
                        id: 'date-start',
                        parentId: 'group-work',
                        params: {
                            layout: { col: { default: 12 } },
                        },
                    },
                    contacts: {
                        id: 'contacts',
                        parentId: rootComponentId,
                        params: {
                            layout: { col: { default: 24 } },
                        },
                    },
                },
            },
        },
    },
    componentsSchemas: {
        'input-first-name': {
            meta: { id: 'input-first-name', type: 'base', name: 'input' },
            properties: { label: 'Имя', value: '' },
        },
        'input-last-name': {
            meta: { id: 'input-last-name', type: 'base', name: 'input' },
            properties: { label: 'Фамилия', value: '' },
        },
        'date-birth': {
            meta: { id: 'date-birth', type: 'base', name: 'date-input' },
            properties: { label: 'Дата рождения', value: '25.10.2005' },
        },
        email: {
            meta: { id: 'email', type: 'base', name: 'email' },
            properties: { label: 'Email' },
        },
        'group-work': {
            meta: { id: 'group-work', type: 'container', name: 'group' },
            properties: { title: 'Рабочая информация' },
        },
        'input-position': {
            meta: { id: 'input-position', type: 'base', name: 'input' },
            properties: { label: 'Должность' },
        },
        'input-salary': {
            meta: { id: 'input-salary', type: 'base', name: 'number-input' },
            properties: { label: 'Зарплата' },
        },
        'select-department': {
            meta: { id: 'select-department', type: 'base', name: 'select' },
            properties: {
                label: 'Отдел',
                options: [
                    { label: 'Разработка', value: 'dev' },
                    { label: 'Маркетинг', value: 'marketing' },
                    { label: 'Продажи', value: 'sales' },
                ],
            },
        },
        'date-start': {
            meta: { id: 'date-start', type: 'base', name: 'date-input' },
            properties: { label: 'Дата начала работы', value: '25.10.1999' },
        },
        contacts: {
            meta: { id: 'contacts', type: 'dynamic-container', name: 'multifield' },
            template: {
                views: {
                    'main-view': {
                        rows: {
                            row_id_1: {
                                id: 'row_id_1',
                                children: [{ id: 'input-first-name' }, { id: 'input-last-name' }],
                            },
                            row_id_2: {
                                id: 'row_id_2',
                                children: [{ id: 'date-birth' }, { id: 'email' }],
                            },
                            row_id_3: {
                                id: 'row_id_3',
                                children: [{ id: 'education' }],
                            },
                        },
                        components: {
                            [rootComponentId]: {
                                id: rootComponentId,
                                params: {
                                    layout: { col: { default: 24 } },
                                },
                                rows: [
                                    {
                                        id: 'row_id_1',
                                    },
                                    {
                                        id: 'row_id_2',
                                    },
                                    {
                                        id: 'row_id_3',
                                    },
                                ],
                            },
                            'input-first-name': {
                                id: 'input-first-name',
                                parentId: rootComponentId,
                                params: {
                                    layout: { col: { default: 12 } },
                                },
                            },
                            'input-last-name': {
                                id: 'input-last-name',
                                parentId: rootComponentId,
                                params: {
                                    layout: { col: { default: 12 } },
                                },
                            },
                            'date-birth': {
                                id: 'date-birth',
                                parentId: rootComponentId,
                                params: {
                                    layout: { col: { default: 12 } },
                                },
                            },
                            email: {
                                id: 'email',
                                parentId: rootComponentId,
                                params: {
                                    layout: { col: { default: 12 } },
                                },
                            },
                            education: {
                                id: 'education',
                                parentId: rootComponentId,
                                params: {
                                    layout: { col: { default: 24 } },
                                },
                            },
                        },
                    },
                },
                componentsSchemas: {
                    [rootComponentId]: {
                        meta: {
                            id: rootComponentId,
                            type: 'container',
                            name: 'group',
                        },
                        properties: {
                            title: 'Контакт',
                        },
                    },
                    'input-first-name': {
                        meta: { id: 'input-first-name', type: 'base', name: 'input' },
                        properties: { label: 'Имя', value: '' },
                    },
                    'input-last-name': {
                        meta: { id: 'input-last-name', type: 'base', name: 'input' },
                        properties: { label: 'Фамилия', value: '' },
                    },
                    'date-birth': {
                        meta: { id: 'date-birth', type: 'base', name: 'date-input' },
                        properties: { label: 'Дата рождения', value: '25.10.2005' },
                    },
                    email: {
                        meta: { id: 'email', type: 'base', name: 'email' },
                        properties: { label: 'Email' },
                    },
                    education: {
                        meta: { id: 'education', type: 'dynamic-container', name: 'multifield' },
                        template: {
                            views: {
                                'main-view': {
                                    rows: {
                                        row_id_1: {
                                            id: 'row_id_1',
                                            children: [{ id: 'uni-name' }, { id: 'uni-position' }],
                                        },
                                    },
                                    components: {
                                        [rootComponentId]: {
                                            id: rootComponentId,
                                            params: {
                                                layout: { col: { default: 24 } },
                                            },
                                            rows: [{ id: 'row_id_1' }],
                                        },
                                        'uni-name': {
                                            id: 'uni-name',
                                            parentId: rootComponentId,
                                            params: {
                                                layout: { col: { default: 12 } },
                                            },
                                        },
                                        'uni-position': {
                                            id: 'uni-position',
                                            parentId: rootComponentId,
                                            params: {
                                                layout: { col: { default: 12 } },
                                            },
                                        },
                                    },
                                },
                            },
                            componentsSchemas: {
                                [rootComponentId]: {
                                    meta: {
                                        id: rootComponentId,
                                        type: 'container',
                                        name: 'group',
                                    },
                                    properties: {
                                        title: 'Образование',
                                    },
                                },
                                'uni-name': {
                                    meta: { id: 'uni-name', type: 'base', name: 'input' },
                                    properties: { label: 'Название учебного заведения', value: '' },
                                },
                                'uni-position': {
                                    meta: { id: 'uni-position', type: 'base', name: 'input' },
                                    properties: { label: 'Специальность', value: '' },
                                },
                            },
                        },
                        properties: {
                            title: 'Образование',
                            addButtonText: 'Ещё',
                        },
                    },
                },
            },
            properties: {
                title: 'Контакты',
                addButtonText: 'Добавить',
            },
        },
    },
    validationRules: [],
    relationsRules: [],
}
