import { ComponentsSchemas, EntityId } from '@form-crafter/core'

import { DepsByValidationRules } from '../types'
import { buildReverseDepsGraph } from './build-reverse-deps-graph'
import { extractValidationDeps } from './extract-validation-deps'

export const extractComponentsDepsByValidationRules = (componentsSchemas: ComponentsSchemas): DepsByValidationRules => {
    let ruleIdToDepsComponents: Record<string, EntityId[]> = {}

    Object.values(componentsSchemas).forEach(({ validations }) => {
        ruleIdToDepsComponents = {
            ...ruleIdToDepsComponents,
            ...extractValidationDeps(validations?.schemas),
        }
    })

    return {
        ruleIdToDepsComponents,
        componentsToDependentsRuleIds: buildReverseDepsGraph(ruleIdToDepsComponents),
    }
}
