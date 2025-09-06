import { ComponentModule, createMutationRule, createTextInputComponentModule } from '@form-crafter/core'
import { builders } from '@form-crafter/options-builder'

const createComponentModule = (name: string, label: string, rules: ReturnType<typeof createTextInputComponentModule>['mutations'] = []) => {
    return createTextInputComponentModule({
        name,
        label,
        optionsBuilder: builders.group({
            value: builders.text().required().nullable(),
        }),
        mutations: rules,
        Component: () => null,
    })
}

const optionsBuilder1 = builders.group({
    value: builders.checkbox().label('').required(),
})
const rule1 = createMutationRule({
    key: 'rule1',
    displayName: 'Правило 1',
    optionsBuilder: optionsBuilder1,
    execute: () => ({ properties: {} }),
})
const optionsBuilder2 = builders.group({
    value: builders.checkbox().label('').required(),
    field1: builders.selectComponent(),
    field2: builders.selectComponents(),
})
const rule2 = createMutationRule({
    key: 'rule2',
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
            contacts: builders.multifield(
                builders.group({
                    country: builders.selectComponent(),
                    education: builders.multifield(
                        builders.group({
                            positions: builders.selectComponents(),
                        }),
                    ),
                }),
            ),
        }),
    }),
})
const rule3 = createMutationRule({
    key: 'rule3',
    displayName: 'Правило 3',
    optionsBuilder: optionsBuilder3,
    execute: () => ({ properties: {} }),
})

export const mockComponentsModules: ComponentModule[] = [
    createComponentModule('email', 'Email', [rule1]),
    createComponentModule('password', 'Password', [rule2]),
    createComponentModule('name', 'Name', [rule3]),
]

export const mockMutations = {
    rule1: rule1,
    rule2: rule2,
    rule3: rule3,
}

export const mockEmptyRulesComponentsModules: ComponentModule[] = [
    createComponentModule('email', 'Email'),
    createComponentModule('password', 'Password'),
    createComponentModule('name', 'Name'),
]
