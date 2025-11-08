import { RepeaterComponentSchema } from '@form-crafter/core'
import { createEvent, sample } from 'effector'

import { ComponentsRegistryModel } from '../components-registry-model'
import { AddGroupPayload, RemoveGroupPayload } from './types'
import { createTemplateInstance } from './utils'

type Params = {
    componentsRegistryModel: ComponentsRegistryModel
}

export type RepeaterModel = ReturnType<typeof createRepeaterModel>

export const createRepeaterModel = ({ componentsRegistryModel }: Params) => {
    const addGroup = createEvent<AddGroupPayload>('addGroup')

    const removeGroup = createEvent<RemoveGroupPayload>('removeGroup')

    const startCreateTemplateInstance = sample({
        source: { componentsSchemas: componentsRegistryModel.$componentsSchemas },
        clock: addGroup,
        fn: ({ componentsSchemas }, { repeaterId }) => {
            const { template } = componentsSchemas[repeaterId] as RepeaterComponentSchema
            return { template, repeaterId }
        },
    })

    const templateInstanceCreated = sample({
        clock: startCreateTemplateInstance,
        fn: ({ template, repeaterId }) => {
            // Генерить view graph там, во view. тут только генерация id comp/row, и обновление componentsSchemas
            const { viewElementsGraphs, componentsSchemas: newComponentsSchemas } = createTemplateInstance(template)
            return {
                rootComponentId: repeaterId,
                viewElementsGraphs,
                componentsSchemas: newComponentsSchemas,
            }
        },
    })

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

    return {
        addGroup,
        removeGroup,
        templateInstanceCreated,
    }
}
