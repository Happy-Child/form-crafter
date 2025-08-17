import { ComponentsSchemas } from '@form-crafter/core'
import { combine, createStore } from 'effector'
import { cloneDeep, merge } from 'lodash-es'

import { SchemaService } from '../../../schema'
import { GroupValidationRuleSchemas } from '../../../schema'
import { ThemeService } from '../../../theme'
import { DepsByValidationRules } from './types'
import {
    buildReverseDepsGraph,
    buildSortedDependents,
    extractComponentsDepsByMutationRules,
    extractComponentsDepsByValidationRules,
    extractComponentsDepsByVisabilityConditions,
    extractValidationDeps,
    topologicalSortDeps,
} from './utils'

type Params = {
    themeService: ThemeService
    schemaService: SchemaService
    initialComponentsSchemas: ComponentsSchemas
}

export type DepsOfRulesModel = ReturnType<typeof createDepsOfRulesModel>

export const createDepsOfRulesModel = ({ initialComponentsSchemas, themeService, schemaService }: Params) => {
    const $componentsDepsByVisabilityConditions = createStore(extractComponentsDepsByVisabilityConditions(initialComponentsSchemas))

    const $componentsDepsByValidationRules = createStore(extractComponentsDepsByValidationRules(initialComponentsSchemas))

    const $componentsDepsByMutationRules = combine(themeService.$mutationsRules, (rules) =>
        extractComponentsDepsByMutationRules(initialComponentsSchemas, rules),
    )

    const $componentsDepsTriggeredMutationRules = combine(
        $componentsDepsByMutationRules,
        $componentsDepsByVisabilityConditions,
        (depsByMutation, depsByVisability) => merge(cloneDeep(depsByMutation), depsByVisability),
    )

    const $componentsByResolutionAllMutationRules = combine($componentsDepsTriggeredMutationRules, ({ componentIdToDeps }) => {
        const componentsIdsWithMutationRules = Object.keys(componentIdToDeps)
        return topologicalSortDeps(componentsIdsWithMutationRules, componentIdToDeps)
    })
    const $componentsByResolutionMutationRules = combine($componentsDepsTriggeredMutationRules, ({ componentIdToDependents, componentIdToDeps }) =>
        buildSortedDependents(componentIdToDeps, componentIdToDependents),
    )

    const $componentsDepsByGroupValidationRules = combine<GroupValidationRuleSchemas, DepsByValidationRules>(
        schemaService.$groupValidationSchemas,
        (groupValidationSchemas) => {
            const schemas = Object.entries(groupValidationSchemas).map(([, schema]) => schema)
            const ruleIdToDepsComponents = extractValidationDeps(schemas)
            return { ruleIdToDepsComponents, componentsToDependentsRuleIds: buildReverseDepsGraph(ruleIdToDepsComponents) }
        },
    )

    return {
        $componentsDepsTriggeredMutationRules,
        $componentsByResolutionAllMutationRules,
        $componentsByResolutionMutationRules,
        $componentsDepsByGroupValidationRules,
        $componentsDepsByValidationRules,
        $componentsDepsByVisabilityConditions,
    }
}
