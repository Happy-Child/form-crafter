import { ComponentModule, createMutationRule, createTextInputComponentModule } from '@form-crafter/core'
import { builders } from '@form-crafter/options-builder'

const rule1 = createMutationRule({
    key: 'rule1',
    displayName: 'Правило 1',
    optionsBuilder: builders.group({
        value: builders.checkbox().label('').required(),
    }),
    execute: () => ({ properties: {} }),
})

const rule2 = createMutationRule({
    key: 'rule2',
    displayName: 'Правило 2',
    optionsBuilder: builders.group({
        value: builders.checkbox().label('').required(),
    }),
    execute: () => ({ properties: {} }),
})

const rule3 = createMutationRule({
    key: 'rule3',
    displayName: 'Правило 3',
    optionsBuilder: builders.group({
        value: builders.checkbox().label('').required(),
    }),
    execute: () => ({ properties: {} }),
})

export const mockComponentsModules: ComponentModule[] = [
    createTextInputComponentModule({
        name: 'email',
        label: 'Email',
        optionsBuilder: builders.group({
            value: builders.text().required().nullable(),
        }),
        mutations: [rule1],
        Component: () => null,
    }),
    createTextInputComponentModule({
        name: 'password',
        label: 'Password',
        optionsBuilder: builders.group({
            value: builders.text().required().nullable(),
        }),
        mutations: [rule2],
        Component: () => null,
    }),
    createTextInputComponentModule({
        name: 'name',
        label: 'Name',
        optionsBuilder: builders.group({
            value: builders.text().required().nullable(),
        }),
        mutations: [rule3],
        Component: () => null,
    }),
]

export const mockMutations = {
    rule1,
    rule2,
    rule3,
}

export const mockEmptyRulesComponentsModules: ComponentModule[] = mockComponentsModules.map(({ name, label, optionsBuilder }) => ({
    name,
    label,
    optionsBuilder,
    Component: () => null,
}))
