import { extractRelationsRules } from '../extract-relations-rules'
import { getDepsPathsRulesComponents } from '../get-deps-paths-rules-components'
import { mockEmptyRulesTheme, mockTheme } from './mocks'

describe('getDepsPathsRulesComponents', () => {
    it('should get paths from components relations rules', () => {
        const relationsRules = extractRelationsRules(mockTheme)
        const result = getDepsPathsRulesComponents(relationsRules)

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
        const relationsRules = extractRelationsRules(mockEmptyRulesTheme)
        const result = getDepsPathsRulesComponents(relationsRules)

        expect(result).toEqual({})
    })
})
