import { getDepsPathsRulesComponents } from '../get-deps-paths-rules-components'
import { mockEmptyRulesTheme, mockTheme } from './mocks'

describe('getDepsPathsRulesComponents', () => {
    it('should get paths from components relations rules', () => {
        const result = getDepsPathsRulesComponents(mockTheme)

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
        const result = getDepsPathsRulesComponents(mockEmptyRulesTheme)

        expect(result).toEqual({})
    })
})
