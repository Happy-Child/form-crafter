import { Schema } from '@form-crafter/core'
import { genId } from '@form-crafter/utils'

export const employeeSchema: Schema = {
    id: 'employee-form',
    validations: {
        additionalTriggers: ['onBlur'],
        schemas: [
            {
                id: genId(),
                key: 'oneOfNotEmpty',
                options: {
                    componentMessage: 'Одно из полей обязательно',
                    formMessage: 'Одно из полей {componentLabels} должно быть заполнено',
                    oneOfFields: ['input-first-name', 'date-birth', 'input-last-name', 'select-department'],
                },
                condition: {
                    type: 'operator',
                    operator: 'and',
                    operands: [
                        { type: 'component', componentId: 'email', operatorKey: 'isEmpty' },
                        { type: 'component', componentId: 'input-position', operatorKey: 'isEmpty' },
                    ],
                },
            },
        ],
    },
    layout: {
        colsSpanPx: { default: 24 },
        rowsSpanPx: { default: 36 },
    },
    views: {
        default: {
            xxl: {
                elements: [
                    {
                        id: genId(),
                        type: 'row',
                        children: [{ id: 'gender', type: 'component', layout: { col: 'auto' } }],
                    },
                    {
                        id: genId(),
                        type: 'row',
                        children: [
                            { id: 'input-first-name', type: 'component', layout: { col: 12 } },
                            { id: 'input-last-name', type: 'component', layout: { col: 12 } },
                        ],
                    },
                    {
                        id: genId(),
                        type: 'row',
                        children: [
                            { id: 'date-birth', type: 'component', layout: { col: 'auto' } },
                            { id: 'email', type: 'component', layout: { col: 19 } },
                        ],
                    },
                    {
                        id: genId(),
                        type: 'row',
                        children: [
                            { id: 'country', type: 'component', layout: { col: 12 } },
                            { id: 'region', type: 'component', layout: { col: 12 } },
                        ],
                    },
                    {
                        id: genId(),
                        type: 'row',
                        children: [
                            {
                                id: 'group-work',
                                type: 'component',
                                layout: { col: 'auto' },
                                children: [
                                    {
                                        id: genId(),
                                        type: 'row',
                                        children: [
                                            { id: 'select-department', type: 'component', layout: { col: 12 } },
                                            { id: 'date-start', type: 'component', layout: { col: 12 } },
                                        ],
                                    },
                                    {
                                        id: genId(),
                                        type: 'row',
                                        children: [{ id: 'input-position', type: 'component', layout: { col: 'auto' } }],
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        id: genId(),
                        type: 'row',
                        children: [
                            {
                                id: 'contacts',
                                type: 'component',
                                layout: { col: 24 },
                            },
                        ],
                    },
                ],
            },
        },
        additionals: {
            someView: {
                id: 'someView',
                condition: { type: 'component', componentId: 'gender', operatorKey: 'equal', enteredComponentValue: 'female' },
                responsive: {
                    xxl: {
                        elements: [
                            {
                                id: genId(),
                                type: 'row',
                                children: [{ id: 'gender', type: 'component', layout: { col: 'auto' } }],
                            },
                            {
                                id: genId(),
                                type: 'row',
                                children: [
                                    { id: 'input-first-name', type: 'component', layout: { col: 12 } },
                                    { id: 'input-last-name', type: 'component', layout: { col: 12 } },
                                ],
                            },
                            {
                                id: genId(),
                                type: 'row',
                                children: [
                                    { id: 'date-birth', type: 'component', layout: { col: 'auto' } },
                                    { id: 'email', type: 'component', layout: { col: 19 } },
                                ],
                            },
                            {
                                id: genId(),
                                type: 'row',
                                children: [
                                    { id: 'country', type: 'component', layout: { col: 12 } },
                                    { id: 'region', type: 'component', layout: { col: 12 } },
                                ],
                            },
                            {
                                id: genId(),
                                type: 'row',
                                children: [
                                    {
                                        id: 'group-work',
                                        type: 'component',
                                        layout: { col: 'auto' },
                                        children: [
                                            {
                                                id: genId(),
                                                type: 'row',
                                                children: [
                                                    { id: 'select-department', type: 'component', layout: { col: 12 } },
                                                    { id: 'date-start', type: 'component', layout: { col: 12 } },
                                                ],
                                            },
                                            {
                                                id: genId(),
                                                type: 'row',
                                                children: [{ id: 'input-position', type: 'component', layout: { col: 'auto' } }],
                                            },
                                        ],
                                    },
                                ],
                            },
                            {
                                id: genId(),
                                type: 'row',
                                children: [
                                    {
                                        id: 'contacts',
                                        type: 'component',
                                        layout: { col: 24 },
                                    },
                                ],
                            },
                        ],
                    },
                },
            },
        },
    },
    componentsSchemas: {
        gender: {
            meta: { id: 'gender', type: 'select', name: 'radio' },
            properties: {
                label: 'Пол',
                value: 'male',
                options: [
                    {
                        label: 'Мужской',
                        value: 'male',
                    },
                    {
                        label: 'Женский',
                        value: 'female',
                    },
                    {
                        label: 'Другой',
                        value: 'other',
                    },
                ],
            },
            validations: {
                schemas: [
                    {
                        id: genId(),
                        key: 'isRequired',
                        options: { message: 'Обязательное поле' },
                    },
                ],
            },
        },
        'input-first-name': {
            meta: { id: 'input-first-name', type: 'text-input', name: 'text-input' },
            properties: { label: 'Имя', value: 'Egor' },
            mutations: {
                schemas: [
                    {
                        id: genId(),
                        key: 'disabled',
                        condition: { type: 'component', componentId: 'some-date', operatorKey: 'isNotEmpty' },
                    },
                ],
            },
            validations: {
                schemas: [
                    {
                        id: genId(),
                        key: 'isRequired',
                        options: { message: 'Обязательное поле' },
                        condition: { type: 'component', componentId: 'date-birth', operatorKey: 'isNotEmpty' },
                    },
                    {
                        id: genId(),
                        key: 'minLength',
                        options: { message: 'Минимальная длинна {minLength}', minLength: 4 },
                    },
                ],
            },
        },
        'input-last-name': {
            meta: { id: 'input-last-name', type: 'text-input', name: 'text-input' },
            visability: { condition: { type: 'component', componentId: 'input-salary', operatorKey: 'isNotEmpty' } },
            properties: { label: 'Фамилия', value: '' },
            mutations: {
                schemas: [
                    {
                        id: genId(),
                        key: 'duplicateValue',
                        options: { duplicateValueComponentId: 'input-first-name' },
                    },
                ],
            },
            validations: {
                schemas: [
                    {
                        id: genId(),
                        key: 'minLength',
                        options: { message: 'Минимальная длинна {minLength}', minLength: 6 },
                    },
                ],
            },
        },
        'date-birth': {
            meta: { id: 'date-birth', type: 'date-input', name: 'date-input' },
            properties: { label: 'Дата рождения', value: null },
        },
        email: {
            meta: { id: 'email', type: 'text-input', name: 'text-input' },
            properties: { label: 'Email', value: '' },
            visability: { condition: { type: 'component', componentId: 'date-birth', operatorKey: 'equal', enteredComponentValue: '25.10.1999' } },
            // visability: { condition: { type: 'component', componentId: 'country', operatorKey: 'isNotEmpty' } },
            mutations: {
                schemas: [
                    {
                        id: genId(),
                        key: 'duplicateValue',
                        options: { duplicateValueComponentId: 'input-first-name' },
                        condition: { type: 'component', componentId: 'date-birth', operatorKey: 'isNotEmpty' },
                    },
                ],
            },
            validations: {
                schemas: [
                    {
                        id: genId(),
                        key: 'isRequired',
                        options: { message: 'Обязательное поле' },
                        condition: {
                            type: 'operator',
                            operator: 'and',
                            operands: [{ type: 'component', componentId: 'input-salary', operatorKey: 'isNotEmpty' }],
                        },
                    },
                    {
                        id: genId(),
                        key: 'isEmail',
                        options: { message: 'Неверный формат поты' },
                        condition: { type: 'component', componentId: 'input-first-name', operatorKey: 'startsWith', options: { startsWith: 'egor' } },
                    },
                ],
            },
        },
        'group-work': {
            meta: { id: 'group-work', type: 'container', name: 'group' },
            properties: { title: 'Рабочая информация' },
        },
        'input-position': {
            meta: { id: 'input-position', type: 'text-input', name: 'text-input' },
            visability: { condition: { type: 'component', componentId: 'email', operatorKey: 'isNotEmpty' } },
            properties: { label: 'Должность', value: 'HR' },
        },
        'input-salary': {
            meta: { id: 'input-salary', type: 'number-input', name: 'number-input' },
            properties: { label: 'Зарплата', value: '' },
        },
        country: {
            meta: { id: 'country', type: 'select', name: 'select' },
            visability: { condition: { type: 'component', componentId: 'select-department', operatorKey: 'equal', enteredComponentValue: 'dev' } },
            properties: {
                value: '',
                label: 'Страна',
                options: [
                    { label: 'Беларусь', value: 'belarus' },
                    { label: 'Армения', value: 'armeny' },
                    { label: 'Чили', value: 'chili' },
                ],
            },
            mutations: {
                schemas: [
                    {
                        id: genId(),
                        key: 'disabled',
                        condition: { type: 'component', componentId: 'select-department', operatorKey: 'equal', enteredComponentValue: 'dev' },
                    },
                ],
            },
        },
        region: {
            meta: { id: 'region', type: 'select', name: 'select' },
            visability: { condition: { type: 'component', componentId: 'date-start', operatorKey: 'isNotEmpty' } },
            properties: {
                value: '',
                label: 'Область',
                options: [],
            },
            mutations: {
                schemas: [
                    {
                        id: genId(),
                        key: 'changeSelectOptions',
                        options: {
                            newOptions: [
                                { label: 'Брестская область', value: 'brest' },
                                { label: 'Витебская область', value: 'vitebsk' },
                                { label: 'Гомельская область', value: 'gomel' },
                                { label: 'Гродненская область', value: 'grodno' },
                                { label: 'Минская область', value: 'minsk_region' },
                                { label: 'Могилёвская область', value: 'mogilev' },
                            ],
                        },
                        condition: {
                            type: 'operator',
                            operator: 'or',
                            operands: [{ type: 'component', componentId: 'country', operatorKey: 'equal', enteredComponentValue: 'belarus' }],
                        },
                    },
                    {
                        id: genId(),
                        key: 'changeSelectOptions',
                        options: {
                            newOptions: [
                                { label: 'Арагацотн', value: 'aragatsotn' },
                                { label: 'Арарат', value: 'ararat' },
                                { label: 'Армавир', value: 'armavir' },
                                { label: 'Гегаркуник', value: 'gegharkunik' },
                                { label: 'Котайк', value: 'kotayk' },
                                { label: 'Лори', value: 'lori' },
                                { label: 'Ширак', value: 'shirak' },
                                { label: 'Сюник', value: 'syunik' },
                                { label: 'Тавуш', value: 'tavush' },
                                { label: 'Вайоц Дзор', value: 'vayots_dzor' },
                            ],
                        },
                        condition: {
                            type: 'operator',
                            operator: 'or',
                            operands: [{ type: 'component', componentId: 'country', operatorKey: 'equal', enteredComponentValue: 'armeny' }],
                        },
                    },
                    {
                        id: genId(),
                        key: 'changeSelectOptions',
                        options: {
                            newOptions: [
                                { label: 'Аріка-и-Парінакота', value: 'arica_parinacota' },
                                { label: 'Тарапака', value: 'tarapaca' },
                                { label: 'Антофагаста', value: 'antofagasta' },
                                { label: 'Атакама', value: 'atacama' },
                                { label: 'Кокимбо', value: 'coquimbo' },
                                { label: 'Вальпараисо', value: 'valparaiso' },
                                { label: 'Столичный регион Сантьяго', value: 'santiago_metropolitan' },
                                { label: 'О’Хиггинс', value: 'ohiggins' },
                                { label: 'Мауле', value: 'maule' },
                                { label: 'Ньюбле', value: 'nuble' },
                                { label: 'Био-Био', value: 'biobio' },
                                { label: 'Араукания', value: 'araucania' },
                                { label: 'Лос-Риос', value: 'los_rios' },
                                { label: 'Лос-Лагос', value: 'los_lagos' },
                                { label: 'Айсен', value: 'aisen' },
                            ],
                        },
                        condition: {
                            type: 'operator',
                            operator: 'or',
                            operands: [{ type: 'component', componentId: 'country', operatorKey: 'equal', enteredComponentValue: 'chili' }],
                        },
                    },
                ],
            },
        },
        'select-department': {
            meta: { id: 'select-department', type: 'select', name: 'select' },
            properties: {
                value: '',
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
                        id: genId(),
                        key: 'changeSelectOptions',
                        options: {
                            newOptions: [
                                { label: 'Менеджмент', value: 'manager' },
                                { label: 'Уборка', value: 'example' },
                                { label: 'Продажи', value: 'marketing' },
                            ],
                        },
                        condition: {
                            type: 'operator',
                            operator: 'or',
                            operands: [{ type: 'component', componentId: 'input-position', operatorKey: 'startsWith', options: { startsWith: 'egor' } }],
                        },
                    },
                ],
            },
        },
        'date-start': {
            meta: { id: 'date-start', type: 'date-input', name: 'date-input' },
            properties: { label: 'Дата начала работы', value: '25.10.1999' },
        },
        'some-date': {
            meta: { id: 'some-date', type: 'date-input', name: 'date-input' },
            properties: { label: 'Другая дата', value: '' },
        },
        contacts: {
            meta: { id: 'contacts', type: 'repeater', name: 'multifield' },
            template: {
                views: {
                    default: {
                        xxl: {
                            elements: [
                                {
                                    id: genId(),
                                    type: 'row',
                                    children: [
                                        {
                                            id: 'contact-group',
                                            type: 'component',
                                            layout: { col: 24 },
                                            children: [
                                                {
                                                    id: genId(),
                                                    type: 'row',
                                                    children: [
                                                        { id: 'contact-input-first-name', type: 'component', layout: { col: 12 } },
                                                        { id: 'contact-input-last-name', type: 'component', layout: { col: 12 } },
                                                    ],
                                                },
                                                {
                                                    id: genId(),
                                                    type: 'row',
                                                    children: [
                                                        { id: 'contact-date-birth', type: 'component', layout: { col: 12 } },
                                                        { id: 'contact-email', type: 'component', layout: { col: 12 } },
                                                    ],
                                                },
                                                {
                                                    id: genId(),
                                                    type: 'row',
                                                    children: [{ id: 'contact-education', type: 'component', layout: { col: 24 } }],
                                                },
                                            ],
                                        },
                                    ],
                                },
                            ],
                        },
                    },
                    additionals: {
                        someView: {
                            id: 'someView',
                            responsive: {
                                xxl: {
                                    elements: [
                                        {
                                            id: genId(),
                                            type: 'row',
                                            children: [
                                                {
                                                    id: 'contact-group',
                                                    type: 'component',
                                                    layout: { col: 24 },
                                                    children: [
                                                        {
                                                            id: genId(),
                                                            type: 'row',
                                                            children: [
                                                                { id: 'contact-input-first-name', type: 'component', layout: { col: 12 } },
                                                                { id: 'contact-email', type: 'component', layout: { col: 12 } },
                                                            ],
                                                        },
                                                    ],
                                                },
                                            ],
                                        },
                                    ],
                                },
                            },
                        },
                    },
                },
                containerSchema: {
                    meta: {
                        id: 'contact-group',
                        type: 'container',
                        name: 'group',
                    },
                    properties: {
                        title: 'Контакт',
                    },
                },
                componentsSchemas: {
                    'contact-input-first-name': {
                        meta: { id: 'contact-input-first-name', type: 'text-input', name: 'text-input' },
                        properties: { label: 'Имя', value: '' },
                    },
                    'contact-input-last-name': {
                        meta: { id: 'contact-input-last-name', type: 'text-input', name: 'text-input' },
                        properties: { label: 'Фамилия', value: '' },
                    },
                    'contact-date-birth': {
                        meta: { id: 'contact-date-birth', type: 'date-input', name: 'date-input' },
                        properties: { label: 'Дата рождения', value: '25.10.2005' },
                    },
                    'contact-email': {
                        meta: { id: 'contact-email', type: 'text-input', name: 'text-input' },
                        properties: { label: 'Email', value: '' },
                    },
                    'contact-education': {
                        meta: { id: 'contact-education', type: 'repeater', name: 'multifield' },
                        template: {
                            views: {
                                default: {
                                    xxl: {
                                        elements: [
                                            {
                                                id: genId(),
                                                type: 'row',
                                                children: [
                                                    {
                                                        id: 'contact-education-group',
                                                        type: 'component',
                                                        layout: { col: 24 },
                                                        children: [
                                                            {
                                                                id: genId(),
                                                                type: 'row',
                                                                children: [{ id: 'contact-education-name', type: 'component', layout: { col: 24 } }],
                                                            },
                                                            {
                                                                id: genId(),
                                                                type: 'row',
                                                                children: [{ id: 'contact-education-position', type: 'component', layout: { col: 24 } }],
                                                            },
                                                        ],
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                },
                            },
                            containerSchema: {
                                meta: {
                                    id: 'contact-education-group',
                                    type: 'container',
                                    name: 'group',
                                },
                                properties: {
                                    title: 'Образование',
                                },
                            },
                            componentsSchemas: {
                                'contact-education-name': {
                                    meta: { id: 'contact-education-name', type: 'text-input', name: 'text-input' },
                                    properties: { label: 'Название учебного заведения', value: '' },
                                },
                                'contact-education-position': {
                                    meta: { id: 'contact-education-position', type: 'text-input', name: 'text-input' },
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
}
