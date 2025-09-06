import { extractMutations } from '../extract-mutations'
import { mockComponentsModules, mockEmptyRulesComponentsModules, mockMutations } from './mocks'

describe('extractMutations', () => {
    it('should be extract mutations rules from theme', () => {
        const mutationsRules = extractMutations(mockComponentsModules)

        expect(mutationsRules).toEqual(mockMutations)
    })

    it('should be extract empty mutations rules from theme', () => {
        const mutationsRules = extractMutations(mockEmptyRulesComponentsModules)

        expect(mutationsRules).toEqual({})
    })
})
