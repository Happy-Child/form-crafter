import { extractMutationsRules } from '../extract-mutations-rules'
import { mockComponentsModules, mockEmptyRulesComponentsModules, mockMutationsRules } from './mocks'

describe('extractMutationsRules', () => {
    it('should be extract mutations rules from theme', () => {
        const mutationsRules = extractMutationsRules(mockComponentsModules)

        expect(mutationsRules).toEqual(mockMutationsRules)
    })

    it('should be extract empty mutations rules from theme', () => {
        const mutationsRules = extractMutationsRules(mockEmptyRulesComponentsModules)

        expect(mutationsRules).toEqual({})
    })
})
