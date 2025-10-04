import { DepsGraphAsSet } from '../../../../../../types'

export type DepsByValidationRules = {
    ruleIdToDepsComponents: DepsGraphAsSet
    componentsToDependentsRuleIds: DepsGraphAsSet
}
