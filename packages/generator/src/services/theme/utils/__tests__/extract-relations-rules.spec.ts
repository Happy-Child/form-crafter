import { extractRelationsRules } from '../extract-relations-rules'
import { mockEmptyRulesTheme, mockRelationsRules, mockTheme } from './mocks'

describe('extractRelationsRules', () => {
    it('should be extract relations rules from theme', () => {
        const relationsRules = extractRelationsRules(mockTheme)

        expect(relationsRules).toEqual(mockRelationsRules)
    })

    it('should be extract empty relations rules from theme', () => {
        const relationsRules = extractRelationsRules(mockEmptyRulesTheme)

        expect(relationsRules).toEqual([])
    })
})
