import { extractRelationsRules } from '../extract-relations-rules'
import { mockComponentsModules, mockEmptyRulesComponentsModules, mockRelationsRules } from './mocks'

describe('extractRelationsRules', () => {
    it('should be extract relations rules from theme', () => {
        const relationsRules = extractRelationsRules(mockComponentsModules)

        expect(relationsRules).toEqual(mockRelationsRules)
    })

    it('should be extract empty relations rules from theme', () => {
        const relationsRules = extractRelationsRules(mockEmptyRulesComponentsModules)

        expect(relationsRules).toEqual({})
    })
})
