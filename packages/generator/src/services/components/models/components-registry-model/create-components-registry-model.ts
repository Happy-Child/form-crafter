import { ComponentsModels, ComponentToUpdate, EntityId, GetExecutorContextBuilder, GetIsConditionSuccessfulChecker } from '@form-crafter/core'
import { isNotEmpty } from '@form-crafter/utils'
import { attach, combine, createEffect, createEvent, createStore, sample } from 'effector'
import { once, readonly } from 'patronum'

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

    const componentsAddedOrRemoved = createEvent('componentsAddedOrRemoved')
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

    $componentsModels.on(setComponentsModels, (_, data) => data)
    $hiddenComponents.on(setHiddenComponents, (_, newComponentsToHidden) => newComponentsToHidden)

    sample({
        clock: [updateComponentsModelsFx.doneData],
        target: setComponentsModels,
    })

    sample({
        clock: once(init),
        target: [setComponentsModels, componentsAddedOrRemoved],
    })

    return {
        init,
        setComponentsModels,
        componentsAddedOrRemoved,
        updateComponentsModelsFx,
        $componentsModels: readonly($componentsModels),
        $componentsSchemas: readonly($componentsSchemas),
        $hiddenComponents: readonly($hiddenComponents),
        $getExecutorContextBuilder: readonly($getExecutorContextBuilder),
        $getIsConditionSuccessfulChecker: readonly($getIsConditionSuccessfulChecker),
        $currentViewVisibleComponentsSchemas: readonly($currentViewVisibleComponentsSchemas),
    }
}
