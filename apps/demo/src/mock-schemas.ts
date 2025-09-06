import { rootComponentId, Schema } from '@form-crafter/core'
import { genId } from '@form-crafter/generator'

export const employeeFormSchema: Schema = {
    id: 'employee-form',
    version: '1.0',
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
                rows: {
                    row_id_0: {
                        id: 'row_id_0',
                        children: [{ id: 'gender' }],
                    },
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
                    row_id_31: {
                        id: 'row_id_3',
                        children: [{ id: 'country' }, { id: 'region' }],
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
                                id: 'row_id_0',
                            },
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
                                id: 'row_id_31',
                            },
                            {
                                id: 'row_id_4',
                            },
                        ],
                    },
                    gender: {
                        id: 'gender',
                        parentId: rootComponentId,
                        params: {
                            layout: { col: { default: 24 } },
                        },
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
                    country: {
                        id: 'country',
                        parentId: rootComponentId,
                        params: {
                            layout: { col: { default: 12 } },
                        },
                    },
                    region: {
                        id: 'region',
                        parentId: rootComponentId,
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
        additionals: {
            'second-view': {
                condition: { type: 'component', componentId: 'gender', operatorKey: 'equal', enteredComponentValue: 'female' },
                responsive: {
                    xxl: {
                        rows: {
                            row_id_0: {
                                id: 'row_id_0',
                                children: [{ id: 'gender' }],
                            },
                            row_id_1: {
                                id: 'row_id_1',
                                children: [{ id: 'group-work' }],
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
                                rows: [{ id: 'row_id_1' }],
                            },
                            gender: {
                                id: 'gender',
                                parentId: rootComponentId,
                                params: {
                                    layout: { col: { default: 24 } },
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
                            country: {
                                id: 'country',
                                parentId: rootComponentId,
                                params: {
                                    layout: { col: { default: 12 } },
                                },
                            },
                            region: {
                                id: 'region',
                                parentId: rootComponentId,
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
                        },
                    },
                },
            },
            'third-view': {
                condition: { type: 'component', componentId: 'gender', operatorKey: 'equal', enteredComponentValue: 'other' },
                responsive: {
                    xxl: {
                        rows: {
                            row_id_0: {
                                id: 'row_id_0',
                                children: [{ id: 'gender' }],
                            },
                            row_id_1: {
                                id: 'row_id_1',
                                children: [{ id: 'input-first-name' }],
                            },
                            row_id_2: {
                                id: 'row_id_2',
                                children: [{ id: 'email' }],
                            },
                            row_id_3: {
                                id: 'row_id_3',
                                children: [{ id: 'input-salary' }],
                            },
                            row_id_4: {
                                id: 'row_id_4',
                                children: [{ id: 'group-work' }],
                            },
                            'group-work_1': {
                                id: 'row_id_5',
                                children: [{ id: 'input-position' }],
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
                                        id: 'row_id_0',
                                    },
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
                                ],
                            },
                            gender: {
                                id: 'gender',
                                parentId: rootComponentId,
                                params: {
                                    layout: { col: { default: 24 } },
                                },
                            },
                            'input-first-name': {
                                id: 'input-first-name',
                                parentId: rootComponentId,
                                params: {
                                    layout: { col: { default: 12 } },
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
                            'date-start': {
                                id: 'date-start',
                                parentId: 'group-work',
                                params: {
                                    layout: { col: { default: 12 } },
                                },
                            },
                        },
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
                        condition: {
                            type: 'operator',
                            operator: 'or',
                            operands: [
                                { type: 'component', componentId: 'country', operatorKey: 'isNotEmpty' },
                                { type: 'component', componentId: 'input-position', operatorKey: 'isEmpty' },
                            ],
                        },
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
            properties: { label: 'Дата рождения', value: '25.10.2005' },
        },
        email: {
            meta: { id: 'email', type: 'text-input', name: 'text-input' },
            properties: { label: 'Email', value: '' },
            validations: {
                schemas: [
                    {
                        id: genId(),
                        key: 'isRequired',
                        options: { message: 'Обязательное поле' },
                        condition: {
                            type: 'operator',
                            operator: 'and',
                            operands: [
                                { type: 'component', componentId: 'date-birth', operatorKey: 'isNotEmpty' },
                                { type: 'component', componentId: 'input-salary', operatorKey: 'isNotEmpty' },
                            ],
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
            properties: { label: 'Должность', value: '' },
        },
        'input-salary': {
            meta: { id: 'input-salary', type: 'number-input', name: 'number-input' },
            properties: { label: 'Зарплата', value: '' },
        },
        country: {
            meta: { id: 'country', type: 'select', name: 'select' },
            properties: {
                value: '',
                label: 'Страна',
                options: [
                    { label: 'Беларусь', value: 'belarus' },
                    { label: 'Армения', value: 'armeny' },
                    { label: 'Чили', value: 'chili' },
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
                            operands: [
                                { type: 'component', componentId: 'input-last-name', operatorKey: 'startsWith', options: { startsWith: 'lazuka' } },
                                { type: 'component', componentId: 'input-position', operatorKey: 'startsWith', options: { startsWith: 'egor' } },
                            ],
                        },
                    },
                ],
            },
        },
        'date-start': {
            meta: { id: 'date-start', type: 'date-input', name: 'date-input' },
            properties: { label: 'Дата начала работы', value: '25.10.1999' },
        },
        contacts: {
            meta: { id: 'contacts', type: 'repeater', name: 'multifield' },
            template: {
                views: {
                    default: {
                        xxl: {
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
                        meta: { id: 'input-first-name', type: 'text-input', name: 'text-input' },
                        properties: { label: 'Имя', value: '' },
                    },
                    'input-last-name': {
                        meta: { id: 'input-last-name', type: 'text-input', name: 'text-input' },
                        properties: { label: 'Фамилия', value: '' },
                    },
                    'date-birth': {
                        meta: { id: 'date-birth', type: 'date-input', name: 'date-input' },
                        properties: { label: 'Дата рождения', value: '25.10.2005' },
                    },
                    email: {
                        meta: { id: 'email', type: 'text-input', name: 'text-input' },
                        properties: { label: 'Email', value: '' },
                    },
                    education: {
                        meta: { id: 'education', type: 'repeater', name: 'multifield' },
                        template: {
                            views: {
                                default: {
                                    xxl: {
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
                                    meta: { id: 'uni-name', type: 'text-input', name: 'text-input' },
                                    properties: { label: 'Название учебного заведения', value: '' },
                                },
                                'uni-position': {
                                    meta: { id: 'uni-position', type: 'text-input', name: 'text-input' },
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
