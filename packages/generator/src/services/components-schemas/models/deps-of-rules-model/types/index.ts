import { DepsGraphAsSet } from '../../../../../types'

export type DepsByValidationsRules = {
    ruleIdToDepsComponentsIds: DepsGraphAsSet
    componentIdToDependentsRuleIds: DepsGraphAsSet
}

export type DepsByMutationsRules = {
    componentIdToDeps: DepsGraphAsSet
    componentIdToDependents: DepsGraphAsSet
}
