import { createEvent, sample } from 'effector'

import { AddGroupPayload, RemoveGroupPayload, RepeaterModelParams } from './types'

export type RepeaterModel = ReturnType<typeof createRepeaterModel>

export const createRepeaterModel = ({ componentsModel, viewsService }: RepeaterModelParams) => {
    const addGroup = createEvent<AddGroupPayload>('addGroup')

    const removeGroup = createEvent<RemoveGroupPayload>('removeGroup')

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

    return {
        addGroup,
        removeGroup,
    }
}
