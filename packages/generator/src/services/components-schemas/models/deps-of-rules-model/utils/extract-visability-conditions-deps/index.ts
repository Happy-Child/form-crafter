import { ComponentsSchemas } from '@form-crafter/core'
import { isNotEmpty } from '@form-crafter/utils'

import { DepsGraphAsSet } from '../../../../../../types'
import { buildReverseDepsGraph } from '../build-reverse-deps-graph'
import { extractComponentConditionDeps } from '../extract-component-condition-deps'

export const extractVisabilityConditionsDeps = (componentsSchemas: ComponentsSchemas) => {
    let componentIdToDeps: DepsGraphAsSet = {}

    Object.entries(componentsSchemas).forEach(([componentId, { visability }]) => {
        if (!isNotEmpty(visability) || !isNotEmpty(visability.condition)) {
            return
        }

        componentIdToDeps = {
            ...componentIdToDeps,
            [componentId]: extractComponentConditionDeps(visability.condition),
        }
    })

    return {
        componentIdToDeps,
        componentIdToDependents: buildReverseDepsGraph(componentIdToDeps),
    }
}
