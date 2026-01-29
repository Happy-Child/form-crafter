import { EntityId } from '@form-crafter/core'
import { isEmpty, isNotEmpty } from '@form-crafter/utils'
import { createEvent, createStore, sample } from 'effector'
import { readonly } from 'patronum'

import { ComponentsStoreModel } from '../components-store-model'
import { ComponentsTemplates } from './types'

type Params = {
    componentsStoreModel: ComponentsStoreModel
}

export type ComponentsTemplatesModel = ReturnType<typeof createComponentsTemplatesModel>

export const createComponentsTemplatesModel = ({ componentsStoreModel }: Params) => {
    const setTemplates = createEvent<ComponentsTemplates>('setTemplates')
    const $templates = createStore<ComponentsTemplates>({ componentIdToTemplateId: {}, templateIdToComponentsIds: {} }).on(setTemplates, (_, data) => data)

    sample({
        source: { componentsSchemas: componentsStoreModel.$componentsSchemas },
        clock: componentsStoreModel.componentsAddedOrRemoved,
        fn: ({ componentsSchemas: schemas }) => {
            const componentIdToTemplateId: Record<EntityId, EntityId> = {}
            const templateIdToComponentsIds: Record<EntityId, Set<EntityId>> = {}

            Object.entries(schemas).forEach(([componentId, { meta }]) => {
                if (isNotEmpty(meta.templateId)) {
                    const templateId = meta.templateId
                    componentIdToTemplateId[componentId] = templateId

                    if (isEmpty(componentIdToTemplateId[templateId])) {
                        templateIdToComponentsIds[templateId] = new Set()
                    }
                    templateIdToComponentsIds[templateId].add(componentId)
                }
            })

            return {
                componentIdToTemplateId,
                templateIdToComponentsIds,
            }
        },
        target: setTemplates,
    })

    return {
        $templates: readonly($templates),
    }
}
