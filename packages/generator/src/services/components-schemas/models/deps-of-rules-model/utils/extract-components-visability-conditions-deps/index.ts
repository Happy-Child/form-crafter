import { ComponentsSchemas, EntityId } from '@form-crafter/core'
import { isNotEmpty } from '@form-crafter/utils'

import { buildReverseDepsGraph } from '../build-reverse-deps-graph'
import { extractConditionDeps } from '../extract-condition-deps'

export const extractComponentsVisabilityConditionsDeps = (componentsSchemas: ComponentsSchemas) => {
    let componentIdToDeps: Record<EntityId, EntityId[]> = {}

    Object.entries(componentsSchemas).forEach(([componentId, { visability }]) => {
        if (!isNotEmpty(visability) || !isNotEmpty(visability.condition)) {
            return
        }

        componentIdToDeps = {
            ...componentIdToDeps,
            [componentId]: extractConditionDeps([], visability.condition),
        }
    })

    return {
        componentIdToDeps,
        componentIdToDependents: buildReverseDepsGraph(componentIdToDeps),
    }
}
