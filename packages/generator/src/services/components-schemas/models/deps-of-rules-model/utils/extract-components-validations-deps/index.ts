import { ComponentsSchemas, EntityId } from '@form-crafter/core'

import { DepsByValidationRules } from '../../types'
import { buildReverseDepsGraph } from '../build-reverse-deps-graph'
import { extractValidationsSchemasConditionsDeps } from '../extract-validations-schemas-conditions-deps'

export const extractComponentsValidationsConditionsDeps = (componentsSchemas: ComponentsSchemas): DepsByValidationRules => {
    let ruleIdToDepsComponents: Record<string, EntityId[]> = {}

    Object.values(componentsSchemas).forEach(({ validations }) => {
        ruleIdToDepsComponents = {
            ...ruleIdToDepsComponents,
            ...extractValidationsSchemasConditionsDeps(validations?.schemas),
        }
    })

    return {
        ruleIdToDepsComponents,
        componentsToDependentsRuleIds: buildReverseDepsGraph(ruleIdToDepsComponents),
    }
}
