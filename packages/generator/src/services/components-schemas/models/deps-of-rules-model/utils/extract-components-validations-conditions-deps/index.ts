import { ComponentsSchemas } from '@form-crafter/core'

import { DepsGraphAsSet } from '../../../../../../types'
import { DepsByValidationsRules } from '../../types'
import { buildReverseDepsGraph } from '../build-reverse-deps-graph'
import { extractValidationsSchemasConditionsDeps } from '../extract-validations-schemas-conditions-deps'

export type { DepsByValidationsRules }

export const extractComponentsValidationsConditionsDeps = (componentsSchemas: ComponentsSchemas): DepsByValidationsRules => {
    let ruleIdToDepsComponentsIds: DepsGraphAsSet = {}

    Object.values(componentsSchemas).forEach(({ validations }) => {
        ruleIdToDepsComponentsIds = {
            ...ruleIdToDepsComponentsIds,
            ...extractValidationsSchemasConditionsDeps(validations?.schemas),
        }
    })

    return {
        ruleIdToDepsComponentsIds,
        componentIdToDependentsRuleIds: buildReverseDepsGraph(ruleIdToDepsComponentsIds),
    }
}
