import { ComponentModule, createEditableComponentModule, createRelationRule, EditableComponentProperties } from '@form-crafter/core'
import { builders } from '@form-crafter/options-builder'

const createComponentModule = (name: string, label: string, rules: ReturnType<typeof createEditableComponentModule>['relationsRules'] = []) => {
    return createEditableComponentModule({
        name,
        label,
        optionsBuilder: builders.group({
            value: builders.text().required().nullable(),
        }),
        relationsRules: rules,
        Component: () => null,
    })
}

const optionsBuilder1 = builders.group({
    value: builders.checkbox().label('').required(),
})
const rule1 = createRelationRule<EditableComponentProperties, typeof optionsBuilder1>({
    ruleName: 'rule1',
    displayName: 'Правило 1',
    optionsBuilder: optionsBuilder1,
    execute: () => ({ properties: {} }),
})
const optionsBuilder2 = builders.group({
    value: builders.checkbox().label('').required(),
    field1: builders.selectComponent(),
    field2: builders.selectComponents(),
})
const rule2 = createRelationRule<EditableComponentProperties, typeof optionsBuilder2>({
    ruleName: 'rule2',
    displayName: 'Правило 2',
    optionsBuilder: optionsBuilder2,
    execute: () => ({ properties: {} }),
})

const optionsBuilder3 = builders.group({
    value: builders.checkbox().label('').required(),
    field1: builders.selectComponents(),
    nestedGroup: builders.group({
        field1: builders.selectComponent().nullable(),
        field2: builders.selectComponent().nullable(),
        group: builders.group({
            contacts: builders.multifield({
                country: builders.selectComponent(),
                education: builders.multifield({
                    positions: builders.selectComponents(),
                }),
            }),
        }),
    }),
})
const rule3 = createRelationRule<EditableComponentProperties, typeof optionsBuilder3>({
    ruleName: 'rule3',
    displayName: 'Правило 3',
    optionsBuilder: optionsBuilder3,
    execute: () => ({ properties: {} }),
})

export const mockComponentsModules: ComponentModule[] = [
    createComponentModule('email', 'Email', [rule1]),
    createComponentModule('password', 'Password', [rule2]),
    createComponentModule('name', 'Name', [rule3]),
]

export const mockRelationsRules = {
    rule1: rule1,
    rule2: rule2,
    rule3: rule3,
}

export const mockEmptyRulesComponentsModules: ComponentModule[] = [
    createComponentModule('email', 'Email'),
    createComponentModule('password', 'Password'),
    createComponentModule('name', 'Name'),
]
