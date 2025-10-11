import { EntityId } from '@form-crafter/core'
import { combine, createEvent, createStore } from 'effector'

import { ViewsService } from '../../../views'
import { ComponentsModel } from '../components-model'

type Params = {
    componentsModel: ComponentsModel
    viewsService: ViewsService
}

export type VisabilityComponentsModel = ReturnType<typeof createVisabilityComponentsModel>

export const createVisabilityComponentsModel = ({ viewsService, componentsModel }: Params) => {
    const $hiddenComponents = createStore<Set<EntityId>>(new Set())

    const setHiddenComponents = createEvent<Set<EntityId>>('setHiddenComponents')

    $hiddenComponents.on(setHiddenComponents, (_, newComponentsToHidden) => newComponentsToHidden)

    const $currentViewVisibleComponentsSchemas = combine(
        componentsModel.$componentsSchemas,
        viewsService.$currentViewComponents,
        $hiddenComponents,
        (componentsSchemas, currentViewComponents, hiddenComponents) =>
            Object.fromEntries(
                Object.entries(componentsSchemas).filter(([componentId]) => currentViewComponents.has(componentId) && !hiddenComponents.has(componentId)),
            ),
    )

    return {
        setHiddenComponents,
        $hiddenComponents,
        $currentViewVisibleComponentsSchemas,
    }
}
