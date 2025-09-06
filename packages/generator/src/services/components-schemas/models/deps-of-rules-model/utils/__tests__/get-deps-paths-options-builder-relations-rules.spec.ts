import { mockComponentsModules, mockEmptyRulesComponentsModules } from '../../../../../theme/utils/__tests__/mocks'
import { extractMutations } from '../../../../../theme/utils/extract-mutations'
import { buildPathsToOptionsBuilderRulesDeps } from '../build-paths-to-options-builder-rules-deps'

describe('buildPathsToOptionsBuilderRulesDeps', () => {
    it('should get paths from components mutations rules', () => {
        const mutationsRules = extractMutations(mockComponentsModules)
        const result = buildPathsToOptionsBuilderRulesDeps(mutationsRules)

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

    it('should return empty paths from components mutations rules', () => {
        const mutationsRules = extractMutations(mockEmptyRulesComponentsModules)
        const result = buildPathsToOptionsBuilderRulesDeps(mutationsRules)

        expect(result).toEqual({})
    })
})
