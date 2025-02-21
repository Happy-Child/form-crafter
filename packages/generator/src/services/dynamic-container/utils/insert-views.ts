import { EntityId, ViewDefinition, ViewsDefinitions } from '@form-crafter/core'

type InsertViewsParams = {
    views: ViewsDefinitions
    additionalViews: ViewsDefinitions
    dynamicContainerId: EntityId
    additionalRowId: EntityId
}

export const insertViews = ({ views, additionalViews, dynamicContainerId, additionalRowId }: InsertViewsParams): ViewsDefinitions => {
    return Object.fromEntries(
        Object.entries(views).map(([viewId, definition]): [EntityId, ViewDefinition] => {
            if (!(viewId in additionalViews)) {
                return [viewId, definition]
            }

            const additionalDefinition = additionalViews[viewId]
            definition = {
                rows: { ...definition.rows, ...additionalDefinition.rows },
                components: { ...definition.components, ...additionalDefinition.components },
            }

            definition.components[dynamicContainerId] = {
                ...definition.components[dynamicContainerId],
                rows: [...(definition.components[dynamicContainerId].rows || []), { id: additionalRowId }],
            }

            return [viewId, definition]
        }),
    )
}
