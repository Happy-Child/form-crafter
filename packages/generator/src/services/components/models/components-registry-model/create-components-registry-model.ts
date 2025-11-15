import { ComponentsModels, ComponentToUpdate, EntityId, GetExecutorContextBuilder, GetIsConditionSuccessfulChecker } from '@form-crafter/core'
import { isNotEmpty } from '@form-crafter/utils'
import { attach, combine, createEffect, createEvent, createStore, sample } from 'effector'
import { combineEvents, once, readonly } from 'patronum'

import { ThemeService } from '../../../theme'
import { ViewsService } from '../../../views'
import { buildExecutorContext, extractComponentsModels, isConditionSuccessful } from './utils'

type Params = {
    themeService: Pick<ThemeService, '$operators'>
    viewsService: Pick<ViewsService, '$currentViewId' | '$currentViewComponents'>
}

export type ComponentsRegistryModel = ReturnType<typeof createComponentsRegistryModel>

export const createComponentsRegistryModel = ({ viewsService, themeService }: Params) => {
    const $componentsModels = createStore<ComponentsModels>(new Map())

    const $hiddenComponents = createStore<Set<EntityId>>(new Set())

    const addComponentsModels = createEvent<ComponentsModels>('addComponentsModels')
    const removeComponentsModels = createEvent<Set<EntityId>>('removeComponentsModels')
    const setComponentsModels = createEvent<ComponentsModels>('setComponentsModels')

    const setHiddenComponents = createEvent<Set<EntityId>>('setHiddenComponents')
    const init = createEvent<ComponentsModels>('init')

    const $componentsSchemas = combine($componentsModels, extractComponentsModels)

    const $currentViewVisibleComponentsSchemas = combine(
        $componentsSchemas,
        viewsService.$currentViewComponents,
        $hiddenComponents,
        (componentsSchemas, currentViewComponents, hiddenComponents) =>
            Object.fromEntries(
                Object.entries(componentsSchemas).filter(([componentId]) => currentViewComponents.has(componentId) && !hiddenComponents.has(componentId)),
            ),
    )

    const $getExecutorContextBuilder: GetExecutorContextBuilder = combine(
        $componentsSchemas,
        viewsService.$currentViewId,
        (componentsSchemas, currentViewId) => {
            return (params) => buildExecutorContext({ componentsSchemas: params?.componentsSchemas || componentsSchemas, currentViewId })
        },
    )

    const $getIsConditionSuccessfulChecker: GetIsConditionSuccessfulChecker = combine(
        $getExecutorContextBuilder,
        themeService.$operators,
        (getExecutorContextBuilder, operators) => (params) => {
            const ctx = params?.ctx || getExecutorContextBuilder()
            return ({ condition }) => isConditionSuccessful({ ctx, condition, operators })
        },
    )

    const baseUpdateModelsFx = createEffect<
        {
            componentsModels: ComponentsModels
            componentsToUpdate: ComponentToUpdate[]
        },
        ComponentsModels
    >(({ componentsModels, componentsToUpdate }) => {
        const newModel = componentsToUpdate.reduce((map, { componentId, schema, isNewValue }) => {
            const model = map.get(componentId)
            if (isNotEmpty(model)) {
                model.setSchema({ schema, isNewValue })
            }
            return map
        }, new Map(componentsModels))

        return Promise.resolve(newModel)
    })
    const updateComponentsModelsFx = attach({
        source: $componentsModels,
        mapParams: (componentsToUpdate: ComponentToUpdate[], componentsModels: ComponentsModels) => ({
            componentsModels,
            componentsToUpdate,
        }),
        effect: baseUpdateModelsFx,
    })

    $componentsModels.on(setComponentsModels, (_, models) => models)
    $hiddenComponents.on(setHiddenComponents, (_, newComponentsToHidden) => newComponentsToHidden)

    sample({
        clock: [updateComponentsModelsFx.doneData],
        target: setComponentsModels,
    })

    sample({
        clock: once(init),
        target: setComponentsModels,
    })

    sample({
        source: { componentsModels: $componentsModels },
        clock: addComponentsModels,
        fn: ({ componentsModels: currentModels }, newModels) =>
            Array.from(newModels.entries()).reduce((result, [componentId, model]) => {
                result.set(componentId, model)
                return result
            }, new Map(currentModels)),
        target: setComponentsModels,
    })

    sample({
        source: { componentsModels: $componentsModels },
        clock: removeComponentsModels,
        fn: ({ componentsModels }, idsToRemove) => {
            const newModels = new Map(componentsModels)
            idsToRemove.forEach((id) => {
                newModels.delete(id)
            })
            return newModels
        },
        target: setComponentsModels,
    })

    const componentsAddedOrRemoved = sample({
        clock: [
            combineEvents([once(init), $componentsModels.updates]),
            combineEvents([addComponentsModels, $componentsModels.updates]),
            combineEvents([removeComponentsModels, $componentsModels.updates]),
        ],
    })

    const componentsAdded = sample({
        clock: [combineEvents([addComponentsModels, $componentsModels.updates])],
    })

    return {
        init,
        updateComponentsModelsFx,
        addComponentsModels,
        removeComponentsModels,
        componentsAddedOrRemoved,
        componentsAdded,
        $componentsModels: readonly($componentsModels),
        $componentsSchemas: readonly($componentsSchemas),
        $hiddenComponents: readonly($hiddenComponents),
        $getExecutorContextBuilder: readonly($getExecutorContextBuilder),
        $getIsConditionSuccessfulChecker: readonly($getIsConditionSuccessfulChecker),
        $currentViewVisibleComponentsSchemas: readonly($currentViewVisibleComponentsSchemas),
    }
}
