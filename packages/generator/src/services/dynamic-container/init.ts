import { DynamicContainerComponentSchema } from '@form-crafter/core'
import { sample } from 'effector'

import { DynamicContainerParams, DynamicContainerService } from './types'
import { createViewsDefinitions, extractRelevantViews, insertViews, removeViewRow } from './utils'

type Params = Pick<DynamicContainerService, 'addDynamicContainerChildEvent' | 'removeDynamicContainerChildEvent'> &
    Pick<DynamicContainerParams, 'componentsSchemasService' | 'viewsService'> & {}

export const init = ({ componentsSchemasService, viewsService, addDynamicContainerChildEvent, removeDynamicContainerChildEvent }: Params) => {
    const executeAddDynamicContainerChildEvent = sample({
        source: { views: viewsService.$views, componentsSchemas: componentsSchemasService.$schemas },
        clock: addDynamicContainerChildEvent,
        fn: ({ views: currentViews, componentsSchemas }, { dynamicContainerId }) => {
            const { template } = componentsSchemas[dynamicContainerId] as DynamicContainerComponentSchema

            const {
                views: additionalViews,
                componentsSchemas: additionalComponentsSchemas,
                additionalRowId,
            } = createViewsDefinitions(template, dynamicContainerId)

            const finalViews = insertViews({
                views: currentViews,
                additionalViews,
                dynamicContainerId,
                additionalRowId,
            })

            return {
                views: finalViews,
                componentsSchemas: additionalComponentsSchemas,
            }
        },
    })

    sample({
        clock: executeAddDynamicContainerChildEvent,
        fn: ({ componentsSchemas }) => componentsSchemas,
        target: componentsSchemasService.updateComponentsSchemasEvent,
    })

    sample({
        clock: executeAddDynamicContainerChildEvent,
        fn: ({ views }) => views,
        target: viewsService.setViewsEvent,
    })

    const executeRemoveDynamicContainerChildEvent = sample({
        source: { views: viewsService.$views, componentsSchemas: componentsSchemasService.$schemas },
        clock: removeDynamicContainerChildEvent,
        fn: ({ views: currentViews, componentsSchemas }, { rowId, dynamicContainerId }) => {
            const { template } = componentsSchemas[dynamicContainerId] as DynamicContainerComponentSchema

            const relevantViews = extractRelevantViews(currentViews, template.views)
            const { views: finalViews, componentsIdsToRemove } = removeViewRow(relevantViews, dynamicContainerId, rowId)

            return {
                views: finalViews,
                componentsIdsToRemove,
            }
        },
    })

    sample({
        clock: executeRemoveDynamicContainerChildEvent,
        fn: ({ componentsIdsToRemove }) => ({ ids: componentsIdsToRemove }),
        target: componentsSchemasService.removeComponentsSchemasByIdsEvent,
    })

    sample({
        clock: executeRemoveDynamicContainerChildEvent,
        fn: ({ views }) => views,
        target: viewsService.setViewsEvent,
    })
}
