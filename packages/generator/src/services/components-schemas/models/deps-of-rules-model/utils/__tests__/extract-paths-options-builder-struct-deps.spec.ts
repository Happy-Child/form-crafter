import { builders } from '@form-crafter/options-builder'

import { extractPathsOptionsBuilderDeps } from '../extract-paths-options-builder-deps'

describe('extractPathsOptionsBuilderDeps', () => {
    it('should extract paths from group builder', () => {
        const groupBuilder = builders.group({
            name: builders.text(),
            age: builders.number(),
            company: builders.selectComponent(),
            info: builders.group({
                street: builders.number(),
                user: builders.selectComponent(),
                group: builders.group({
                    users: builders.selectComponents(),
                    contacts: builders.multifield({
                        country: builders.selectComponent(),
                        education: builders.multifield({
                            positions: builders.selectComponents(),
                        }),
                    }),
                }),
            }),
        })

        const result = extractPathsOptionsBuilderDeps(groupBuilder.struct)

        expect(result).toEqual([
            ['company'],
            ['info', 'user'],
            ['info', 'group', 'users'],
            ['info', 'group', 'contacts', 'country'],
            ['info', 'group', 'contacts', 'education', 'positions'],
        ])
    })

    it('should return empty array for empty group builder', () => {
        const groupBuilder = builders.group({})

        const result = extractPathsOptionsBuilderDeps(groupBuilder.struct)

        expect(result).toEqual([])
    })
})
