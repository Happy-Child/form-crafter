import { RepeaterComponentSchema } from '@form-crafter/core'
import { sample } from 'effector'

import { RepeaterService, RepeaterServiceParams } from './types'
import { createViewsDefinitions, extractRelevantViews, insertViews, removeViewRow } from './utils'

type Params = Pick<RepeaterService, 'addChildEvent' | 'removeChildEvent'> & Pick<RepeaterServiceParams, 'componentsSchemasService' | 'viewsService'> & {}

export const init = ({ componentsSchemasService, viewsService, addChildEvent, removeChildEvent }: Params) => {
    const executeAddChildEvent = sample({
        source: { views: viewsService.$views, schemasMap: componentsSchemasService.$schemasMap },
        clock: addChildEvent,
        fn: ({ views: currentViews, schemasMap }, { repeaterId }) => {
            const { template } = schemasMap.get(repeaterId)!.$schema.getState() as RepeaterComponentSchema

            const { views: additionalViews, componentsSchemas: additionalComponentsSchemas, additionalRowId } = createViewsDefinitions(template, repeaterId)

            const finalViews = insertViews({
                views: currentViews,
                additionalViews,
                repeaterId,
                additionalRowId,
            })

            return {
                views: finalViews,
                componentsSchemas: additionalComponentsSchemas,
            }
        },
    })

    sample({
        clock: executeAddChildEvent,
        fn: ({ componentsSchemas }) => componentsSchemas,
        target: componentsSchemasService.updateComponentsSchemasEvent,
    })

    sample({
        clock: executeAddChildEvent,
        fn: ({ views }) => views,
        target: viewsService.setViewsEvent,
    })

    const executeRemoveChildEvent = sample({
        source: { views: viewsService.$views, componentsSchemas: componentsSchemasService.$schemasMap },
        clock: removeChildEvent,
        fn: ({ views: currentViews, componentsSchemas }, { rowId, repeaterId }) => {
            const { template } = componentsSchemas.get(repeaterId)!.$schema.getState() as RepeaterComponentSchema

            const relevantViews = extractRelevantViews(currentViews, template.views)
            const { views: finalViews, componentsIdsToRemove } = removeViewRow(relevantViews, repeaterId, rowId)

            return {
                views: finalViews,
                componentsIdsToRemove,
            }
        },
    })

    sample({
        clock: executeRemoveChildEvent,
        fn: ({ componentsIdsToRemove }) => ({ ids: componentsIdsToRemove }),
        target: componentsSchemasService.removeComponentsSchemasByIdsEvent,
    })

    sample({
        clock: executeRemoveChildEvent,
        fn: ({ views }) => views,
        target: viewsService.setViewsEvent,
    })
}
