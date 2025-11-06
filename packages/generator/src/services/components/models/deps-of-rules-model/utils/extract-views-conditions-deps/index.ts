import { ViewDefinition } from '@form-crafter/core'

import { DepsGraphAsSet } from '../../../../../../types'
import { buildReverseDepsGraph } from '../build-reverse-deps-graph'
import { extractComponentConditionDeps } from '../extract-component-condition-deps'

export const extractViewsConditionsDeps = (views: Pick<ViewDefinition, 'id' | 'condition'>[]) => {
    let viewIdToDepsComponents: DepsGraphAsSet = {}

    views.forEach(({ id: viewId, condition }) => {
        viewIdToDepsComponents = {
            ...viewIdToDepsComponents,
            [viewId]: extractComponentConditionDeps(condition),
        }
    })

    return {
        viewIdToDepsComponents,
        componentsToDependentsViewIds: buildReverseDepsGraph(viewIdToDepsComponents),
    }
}
