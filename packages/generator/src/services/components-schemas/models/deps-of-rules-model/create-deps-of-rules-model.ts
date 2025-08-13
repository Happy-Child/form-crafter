import { ComponentsSchemas } from '@form-crafter/core'
import { combine } from 'effector'

import { SchemaService } from '../../../schema'
import { GroupValidationRuleSchemas } from '../../../schema'
import { ThemeService } from '../../../theme'
import { DepsRuleSchema } from './types'
import {
    buildReverseDepsGraph,
    buildSortedDependents,
    extractDepsFromRuleSchemas,
    extractValidationsDeps,
    getDepsPathsOptionsBuilderRules,
    topologicalSortDeps,
} from './utils'

type Params = {
    themeService: ThemeService
    schemaService: SchemaService
    initialComponentsSchemas: ComponentsSchemas
}

export type DepsOfRulesModel = ReturnType<typeof createDepsOfRulesModel>

export const createDepsOfRulesModel = ({ initialComponentsSchemas, themeService, schemaService }: Params) => {
    const $depsComponentsRuleSchemas = combine(themeService.$mutationsRules, (rules) => {
        const depsPaths = getDepsPathsOptionsBuilderRules(rules)
        return extractDepsFromRuleSchemas(initialComponentsSchemas, depsPaths)
    })
    const $depsGroupsValidationRuleSchemas = combine<GroupValidationRuleSchemas, DepsRuleSchema>(
        schemaService.$groupValidationSchemas,
        (groupValidationSchemas) => {
            const validationsList = Object.entries(groupValidationSchemas).map(([, schema]) => schema)
            const depsGraph = extractValidationsDeps(validationsList)
            return { schemaIdToDeps: depsGraph, schemaIdToDependents: buildReverseDepsGraph(depsGraph) }
        },
    )

    const $sortedAllMutationsDependents = combine($depsComponentsRuleSchemas, ({ mutations: { schemaIdToDeps } }) => {
        const componentsWithMutationsRules = Object.keys(schemaIdToDeps)
        return topologicalSortDeps(componentsWithMutationsRules, schemaIdToDeps)
    })
    const $sortedMutationsDependentsByComponent = combine($depsComponentsRuleSchemas, ({ mutations: { schemaIdToDeps, schemaIdToDependents } }) =>
        buildSortedDependents(schemaIdToDeps, schemaIdToDependents),
    )

    return {
        $depsComponentsRuleSchemas,
        $depsGroupsValidationRuleSchemas,
        $sortedAllMutationsDependents,
        $sortedMutationsDependentsByComponent,
    }
}
