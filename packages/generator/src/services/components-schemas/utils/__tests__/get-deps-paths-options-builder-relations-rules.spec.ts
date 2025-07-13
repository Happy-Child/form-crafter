import { mockComponentsModules, mockEmptyRulesComponentsModules } from '../../../theme/utils/__tests__/mocks'
import { extractRelationsRules } from '../../../theme/utils/extract-relations-rules'
import { getDepsPathsOptiondsBuilderRelationsRules } from '../get-deps-paths-options-builder-relations-rules'

describe('getDepsPathsOptiondsBuilderRelationsRules', () => {
    it('should get paths from components relations rules', () => {
        const relationsRules = extractRelationsRules(mockComponentsModules)
        const result = getDepsPathsOptiondsBuilderRelationsRules(relationsRules)

        expect(result).toEqual({
            rule2: [['field1'], ['field2']],
            rule3: [
                ['field1'],
                ['nestedGroup', 'field1'],
                ['nestedGroup', 'field2'],
                ['nestedGroup', 'group', 'contacts', 'country'],
                ['nestedGroup', 'group', 'contacts', 'education', 'positions'],
            ],
        })
    })

    it('should return empty paths from components relations rules', () => {
        const relationsRules = extractRelationsRules(mockEmptyRulesComponentsModules)
        const result = getDepsPathsOptiondsBuilderRelationsRules(relationsRules)

        expect(result).toEqual({})
    })
})
