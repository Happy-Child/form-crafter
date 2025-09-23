import { ComponentsSchemas, EntityId } from '@form-crafter/core'

import { buildReverseDepsGraph } from '../build-reverse-deps-graph'
import { extractValidationsSchemasConditionsDeps } from '../extract-validations-schemas-conditions-deps'
import { DepsByValidationRules } from './types'

export type { DepsByValidationRules }

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
