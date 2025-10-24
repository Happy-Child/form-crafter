import { buildPathsToMutationsRulesDeps, createMutationRule } from '@form-crafter/core'
import { builders } from '@form-crafter/options-builder'

describe('buildPathsToMutationsRulesDeps', () => {
    it('should be build paths', () => {
        const mutationsRules = {
            rule1: createMutationRule({
                key: 'rule1',
                displayName: 'Правило 1',
                optionsBuilder: builders.group({
                    value: builders.checkbox().label('').required(),
                }),
                execute: () => ({ properties: {} }),
                rollback: { default: 'restore' },
            }),
            rule2: createMutationRule({
                key: 'rule2',
                displayName: 'Правило 2',
                optionsBuilder: builders.group({
                    value: builders.checkbox().label('').required(),
                    firstName: builders.selectComponent(),
                    secondName: builders.selectComponents(),
                }),
                execute: () => ({ properties: {} }),
                rollback: { default: 'restore' },
            }),
            rule3: createMutationRule({
                key: 'rule3',
                displayName: 'Правило 3',
                optionsBuilder: builders.group({
                    age: builders.number(),
                    company: builders.selectComponent(),
                    info: builders.group({
                        users: builders.selectComponents(),
                        curs: builders.multifield(builders.selectComponent()),
                        phones: builders.multifield(builders.selectComponents()),
                        streets: builders.multifield(builders.multifield(builders.selectComponent())),
                        names: builders.multifield(builders.multifield(builders.selectComponents())),
                        companies: builders.multifield(
                            builders.multifield(
                                builders.group({
                                    name: builders.selectComponent(),
                                }),
                            ),
                        ),
                        languages: builders.multifield(
                            builders.multifield(
                                builders.group({
                                    entities: builders.selectComponents(),
                                }),
                            ),
                        ),
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
                execute: () => ({ properties: {} }),
            }),
        }

        const result = buildPathsToMutationsRulesDeps(mutationsRules)

        expect(result).toEqual({
            rule2: [['firstName'], ['secondName']],
            rule3: [
                ['company'],
                ['info', 'users'],
                ['info', 'curs'],
                ['info', 'phones'],
                ['info', 'streets'],
                ['info', 'names'],
                ['info', 'companies', 'name'],
                ['info', 'languages', 'entities'],
                ['info', 'contacts', 'country'],
                ['info', 'contacts', 'education', 'positions'],
            ],
        })
    })

    it('should be build empty paths', () => {
        const mutationsRules = {
            rule1: createMutationRule({
                key: 'rule1',
                displayName: 'Правило 1',
                optionsBuilder: builders.group({
                    value: builders.checkbox().label('').required(),
                }),
                execute: () => ({ properties: {} }),
            }),
            rule2: createMutationRule({
                key: 'rule2',
                displayName: 'Правило 2',
                optionsBuilder: builders.group({
                    value: builders.checkbox().label('').required(),
                    firstName: builders.mask(),
                    secondName: builders.miltiCheckbox(),
                }),
                execute: () => ({ properties: {} }),
            }),
            rule3: createMutationRule({
                key: 'rule3',
                displayName: 'Правило 3',
                optionsBuilder: builders.group({
                    age: builders.number(),
                    company: builders.textarea(),
                    info: builders.group({
                        dates: builders.dateRange(),
                        curs: builders.select(),
                        phones: builders.multifield(builders.number()),
                        companies: builders.multifield(
                            builders.multifield(
                                builders.group({
                                    name: builders.text(),
                                }),
                            ),
                        ),
                        contacts: builders.multifield(
                            builders.group({
                                country: builders.slider(),
                                education: builders.multifield(
                                    builders.group({
                                        positions: builders.radio(),
                                    }),
                                ),
                            }),
                        ),
                    }),
                }),
                execute: () => ({ properties: {} }),
            }),
        }

        const result = buildPathsToMutationsRulesDeps(mutationsRules)

        expect(result).toEqual({})
    })

    it('should be build empty paths', () => {
        const result = buildPathsToMutationsRulesDeps({})

        expect(result).toEqual({})
    })
})
