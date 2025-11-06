import { Schema } from '@form-crafter/core'
import { genId } from '@form-crafter/utils'

export const clientSchema: Schema = {
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
                    oneOfFields: ['contactEmail', 'contactPhone'],
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
                        children: [{ id: 'userType', type: 'component', layout: { col: 24 } }],
                    },
                    {
                        id: genId(),
                        type: 'row',
                        children: [
                            { id: 'fullName', type: 'component', layout: { col: 12 } },
                            { id: 'passportNumber', type: 'component', layout: { col: 12 } },
                        ],
                    },
                    {
                        id: genId(),
                        type: 'row',
                        children: [{ id: 'dateBirth', type: 'component', layout: { col: 24 } }],
                    },
                    {
                        id: genId(),
                        type: 'row',
                        children: [
                            { id: 'address', type: 'component', layout: { col: 12 } },
                            { id: 'snils', type: 'component', layout: { col: 12 } },
                        ],
                    },
                    {
                        id: genId(),
                        type: 'row',
                        children: [
                            {
                                id: 'contactsGroup',
                                type: 'component',
                                layout: { col: 24 },
                                children: [
                                    {
                                        id: 'contactsGroup1',
                                        type: 'row',
                                        children: [
                                            { id: 'contactEmail', type: 'component', layout: { col: 12 } },
                                            { id: 'contactPhone', type: 'component', layout: { col: 12 } },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
            lg: {
                elements: [
                    {
                        id: genId(),
                        type: 'row',
                        children: [
                            { id: 'userType', type: 'component', layout: { col: 12 } },
                            { id: 'fullName', type: 'component', layout: { col: 12 } },
                        ],
                    },
                    {
                        id: genId(),
                        type: 'row',
                        children: [{ id: 'passportNumber', type: 'component', layout: { col: 12 } }],
                    },
                    {
                        id: genId(),
                        type: 'row',
                        children: [
                            { id: 'dateBirth', type: 'component', layout: { col: 8 } },
                            { id: 'address', type: 'component', layout: { col: 8 } },
                            { id: 'snils', type: 'component', layout: { col: 8 } },
                        ],
                    },
                    {
                        id: genId(),
                        type: 'row',
                        children: [
                            {
                                id: 'contactsGroup',
                                type: 'component',
                                layout: { col: 24 },
                                children: [
                                    {
                                        id: 'contactsGroup1',
                                        type: 'row',
                                        children: [
                                            { id: 'contactEmail', type: 'component', layout: { col: 12 } },
                                            { id: 'contactPhone', type: 'component', layout: { col: 12 } },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        },
        additionals: {
            ipView: {
                id: 'ipView',
                condition: {
                    type: 'operator',
                    operator: 'and',
                    operands: [{ type: 'component', componentId: 'userType', operatorKey: 'equal', enteredComponentValue: 'ip' }],
                },
                responsive: {
                    xxl: {
                        elements: [
                            {
                                id: genId(),
                                type: 'row',
                                children: [{ id: 'userType', type: 'component', layout: { col: 24 } }],
                            },
                            {
                                id: genId(),
                                type: 'row',
                                children: [
                                    { id: 'fullName', type: 'component', layout: { col: 12 } },
                                    { id: 'passportNumber', type: 'component', layout: { col: 12 } },
                                ],
                            },
                            {
                                id: genId(),
                                type: 'row',
                                children: [
                                    { id: 'dateBirth', type: 'component', layout: { col: 12 } },
                                    { id: 'address', type: 'component', layout: { col: 12 } },
                                ],
                            },
                            {
                                id: genId(),
                                type: 'row',
                                children: [
                                    { id: 'inn', type: 'component', layout: { col: 12 } },
                                    { id: 'ogrn', type: 'component', layout: { col: 12 } },
                                ],
                            },
                            {
                                id: genId(),
                                type: 'row',
                                children: [{ id: 'bankAccount', type: 'component', layout: { col: 24 } }],
                            },
                            {
                                id: genId(),
                                type: 'row',
                                children: [
                                    {
                                        id: 'contactsGroup',
                                        type: 'component',
                                        layout: { col: 24 },
                                        children: [
                                            {
                                                id: 'contactsGroup1',
                                                type: 'row',
                                                children: [
                                                    { id: 'contactEmail', type: 'component', layout: { col: 12 } },
                                                    { id: 'contactPhone', type: 'component', layout: { col: 12 } },
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
            ulView: {
                id: 'ulView',
                condition: {
                    type: 'operator',
                    operator: 'and',
                    operands: [{ type: 'component', componentId: 'userType', operatorKey: 'equal', enteredComponentValue: 'ul' }],
                },
                responsive: {
                    xxl: {
                        elements: [
                            {
                                id: genId(),
                                type: 'row',
                                children: [{ id: 'userType', type: 'component', layout: { col: 24 } }],
                            },
                            {
                                id: genId(),
                                type: 'row',
                                children: [{ id: 'companyName', type: 'component', layout: { col: 24 } }],
                            },
                            {
                                id: genId(),
                                type: 'row',
                                children: [
                                    { id: 'inn', type: 'component', layout: { col: 8 } },
                                    { id: 'kpp', type: 'component', layout: { col: 8 } },
                                    { id: 'ogrn', type: 'component', layout: { col: 8 } },
                                ],
                            },
                            {
                                id: genId(),
                                type: 'row',
                                children: [{ id: 'address', type: 'component', layout: { col: 24 } }],
                            },
                            {
                                id: genId(),
                                type: 'row',
                                children: [{ id: 'bankAccount', type: 'component', layout: { col: 24 } }],
                            },
                            {
                                id: genId(),
                                type: 'row',
                                children: [
                                    {
                                        id: 'contactsGroup',
                                        type: 'component',
                                        layout: { col: 24 },
                                        children: [
                                            {
                                                id: 'contactsGroup1',
                                                type: 'row',
                                                children: [
                                                    { id: 'contactEmail', type: 'component', layout: { col: 12 } },
                                                    { id: 'contactPhone', type: 'component', layout: { col: 12 } },
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
    componentsSchemas: {
        userType: {
            meta: { id: 'userType', type: 'select', name: 'radio' },
            properties: {
                label: 'Тип',
                value: 'fl',
                options: [
                    {
                        label: 'Физ.лицо',
                        value: 'fl',
                    },
                    {
                        label: 'Индивидуальный предприниматель',
                        value: 'ip',
                    },
                    {
                        label: 'Юр. лицо',
                        value: 'ul',
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
        fullName: {
            meta: { id: 'fullName', type: 'text-input', name: 'text-input' },
            properties: { label: 'Имя', value: '' },
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
        passportNumber: {
            meta: { id: 'passportNumber', type: 'text-input', name: 'text-input' },
            properties: { label: 'Паспорт', value: '' },
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
        dateBirth: {
            meta: { id: 'dateBirth', type: 'date-picker', name: 'date-picker' },
            properties: { label: 'Дата рождения', value: '' },
            validations: {
                schemas: [
                    {
                        id: genId(),
                        key: 'isRequired',
                        options: { message: 'Обязательное поле' },
                    },
                    {
                        id: genId(),
                        key: 'isDate',
                    },
                    {
                        id: genId(),
                        key: 'isAdult',
                        options: { message: 'Нет 18-ти лет' },
                    },
                ],
            },
        },
        address: {
            meta: { id: 'address', type: 'text-input', name: 'text-input' },
            properties: { label: 'Адресс', value: '' },
            validations: {
                schemas: [
                    {
                        id: genId(),
                        key: 'isRequired',
                        options: { message: 'Обязательное поле' },
                        condition: { type: 'component', componentId: 'userType', operatorKey: 'equal', enteredComponentValue: 'ul' },
                    },
                ],
            },
        },
        contactsGroup: {
            meta: { id: 'contactsGroup', type: 'container', name: 'group' },
            properties: { title: 'Контакты' },
        },
        contactEmail: {
            meta: { id: 'contactEmail', type: 'text-input', name: 'text-input' },
            properties: { label: 'Почта', value: '' },
            validations: {
                schemas: [
                    {
                        id: genId(),
                        key: 'isEmail',
                        options: { message: 'Неверный формат поты' },
                        condition: { type: 'component', componentId: 'contactEmail', operatorKey: 'isNotEmpty' },
                    },
                ],
            },
        },
        contactPhone: {
            meta: { id: 'contactPhone', type: 'number-input', name: 'number-input' },
            properties: { label: 'Телефон', value: '' },
        },
        snils: {
            meta: { id: 'snils', type: 'number-input', name: 'number-input' },
            properties: { label: 'СНИЛС', value: '' },
        },
        inn: {
            meta: { id: 'inn', type: 'number-input', name: 'number-input' },
            properties: { label: 'ИНН', value: '' },
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
        ogrn: {
            meta: { id: 'ogrn', type: 'number-input', name: 'number-input' },
            properties: { label: 'ОГРН', value: '' },
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
        kpp: {
            meta: { id: 'kpp', type: 'number-input', name: 'number-input' },
            properties: { label: 'КПП', value: '' },
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
        bankAccount: {
            meta: { id: 'bankAccount', type: 'number-input', name: 'number-input' },
            properties: { label: 'Банковский счёт', value: '' },
            validations: {
                schemas: [
                    {
                        id: genId(),
                        key: 'isRequired',
                        options: { message: 'Обязательное поле' },
                    },
                ],
            },
            mutations: {
                schemas: [
                    {
                        id: genId(),
                        key: 'disabled',
                        condition: { type: 'component', componentId: 'inn', operatorKey: 'isEmpty' },
                    },
                    {
                        id: genId(),
                        key: 'clearValue',
                        condition: { type: 'component', componentId: 'inn', operatorKey: 'isEmpty' },
                    },
                ],
            },
        },
        companyName: {
            meta: { id: 'companyName', type: 'text-input', name: 'text-input' },
            properties: { label: 'Банковский счёт', value: '' },
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
    },
}
