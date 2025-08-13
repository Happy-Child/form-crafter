import { EntityId } from '@form-crafter/core'
import { combine, createEvent, createStore } from 'effector'

import { ComponentsModel } from '../components-model'

type Params = {
    componentsModel: ComponentsModel
}

export type VisabilityComponentsModel = ReturnType<typeof createVisabilityComponentsModel>

export const createVisabilityComponentsModel = ({ componentsModel }: Params) => {
    const $hiddenComponentsIds = createStore<Set<EntityId>>(new Set())

    const setHiddenComponentsIdsEvent = createEvent<Set<EntityId>>('setHiddenComponentsIdsEvent')

    $hiddenComponentsIds.on(setHiddenComponentsIdsEvent, (_, newComponentsToHidden) => newComponentsToHidden)

    const $visibleComponentsSchemas = combine(componentsModel.$componentsSchemas, $hiddenComponentsIds, (componentsSchemas, hiddenComponentsIds) => {
        const result = { ...componentsSchemas }
        hiddenComponentsIds.forEach((componentId) => {
            delete result[componentId]
        })
        return result
    })

    const $visibleComponentsIds = combine($visibleComponentsSchemas, (visibleComponentsSchemas) => Object.keys(visibleComponentsSchemas))

    return {
        setHiddenComponentsIdsEvent,
        $visibleComponentsSchemas,
        $visibleComponentsIds,
        $hiddenComponentsIds,
    }
}
