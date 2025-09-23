import { EntityId, ViewDefinition } from '@form-crafter/core'

import { buildReverseDepsGraph } from '../build-reverse-deps-graph'
import { extractConditionDeps } from '../extract-condition-deps'

export const extractViewsConditionsDeps = (views: ViewDefinition[]) => {
    let viewIdToDepsComponents: Record<string, EntityId[]> = {}

    views.forEach(({ id: viewId, condition }) => {
        viewIdToDepsComponents = {
            ...viewIdToDepsComponents,
            [viewId]: extractConditionDeps([], condition),
        }
    })

    return {
        viewIdToDepsComponents,
        componentsToDependentsViewIds: buildReverseDepsGraph(viewIdToDepsComponents),
    }
}
