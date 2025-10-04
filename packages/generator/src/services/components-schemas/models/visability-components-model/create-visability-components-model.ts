import { EntityId } from '@form-crafter/core'
import { combine, createEvent, createStore } from 'effector'

import { ViewsService } from '../../../views'
import { ComponentsModel } from '../components-model'

type Params = {
    componentsModel: ComponentsModel
    viewsService: ViewsService
}

export type VisabilityComponentsModel = ReturnType<typeof createVisabilityComponentsModel>

export const createVisabilityComponentsModel = ({ componentsModel }: Params) => {
    const $hiddenComponents = createStore<Set<EntityId>>(new Set())

    const setHiddenComponents = createEvent<Set<EntityId>>('setHiddenComponents')

    $hiddenComponents.on(setHiddenComponents, (_, newComponentsToHidden) => newComponentsToHidden)

    const $visibleComponentsSchemas = combine(componentsModel.$componentsSchemas, $hiddenComponents, (componentsSchemas, hiddenComponents) => {
        const result = { ...componentsSchemas }
        hiddenComponents.forEach((componentId) => {
            delete result[componentId]
        })
        return result
    })

    const $visibleComponents = combine($visibleComponentsSchemas, (visibleComponentsSchemas) => Object.keys(visibleComponentsSchemas))

    return {
        setHiddenComponents,
        $visibleComponentsSchemas,
        $visibleComponents,
        $hiddenComponents,
    }
}
