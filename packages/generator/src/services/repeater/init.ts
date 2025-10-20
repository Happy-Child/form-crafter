// import { RepeaterComponentSchema } from '@form-crafter/core'
// import { sample } from 'effector'

import { RepeaterService, RepeaterServiceParams } from './types'
// import { createViewsDefinitions, extractRelevantViews, insertViews, removeViewRow } from './utils'

type Params = Pick<RepeaterService, 'addChildEvent' | 'removeChildEvent'> & Pick<RepeaterServiceParams, 'componentsService' | 'viewsService'> & {}

export const init = (params: Params) => {
    console.log(params)
    // const executeAddChildEvent = sample({
    //     source: { views: viewsService.$views, visibleComponentsSchemas: componentsService.componentsModel.$visibleComponentsSchemas },
    //     clock: addChildEvent,
    //     fn: ({ views: currentViews, visibleComponentsSchemas }, { repeaterId }) => {
    //         const { template } = visibleComponentsSchemas[repeaterId] as RepeaterComponentSchema
    //         const { views: additionalViews, componentsSchemas: additionalComponentsSchemas, additionalRowId } = createViewsDefinitions(template, repeaterId)
    //         const finalViews = insertViews({
    //             views: currentViews,
    //             additionalViews,
    //             repeaterId,
    //             additionalRowId,
    //         })
    //         return {
    //             views: finalViews,
    //             componentsSchemas: additionalComponentsSchemas,
    //         }
    //     },
    // })
    // sample({
    //     clock: executeAddChildEvent,
    //     fn: ({ componentsSchemas }) => componentsSchemas,
    //     target: componentsService.updateComponentsSchemasEvent,
    // })
    // sample({
    //     clock: executeAddChildEvent,
    //     fn: ({ views }) => views,
    //     target: viewsService.setViewsEvent,
    // })
    // const executeRemoveChildEvent = sample({
    //     source: { views: viewsService.$views, visibleComponentsSchemas: componentsService.componentsModel.$visibleComponentsSchemas },
    //     clock: removeChildEvent,
    //     fn: ({ views: currentViews, visibleComponentsSchemas }, { rowId, repeaterId }) => {
    //         const { template } = visibleComponentsSchemas[repeaterId] as RepeaterComponentSchema
    //         const relevantViews = extractRelevantViews(currentViews, template.views)
    //         const { views: finalViews, componentsIdsToRemove } = removeViewRow(relevantViews, repeaterId, rowId)
    //         return {
    //             views: finalViews,
    //             componentsIdsToRemove,
    //         }
    //     },
    // })
    // sample({
    //     clock: executeRemoveChildEvent,
    //     fn: ({ componentsIdsToRemove }) => ({ ids: componentsIdsToRemove }),
    //     target: componentsService.removeComponentsSchemasByIdsEvent,
    // })
    // sample({
    //     clock: executeRemoveChildEvent,
    //     fn: ({ views }) => views,
    //     target: viewsService.setViewsEvent,
    // })
}
