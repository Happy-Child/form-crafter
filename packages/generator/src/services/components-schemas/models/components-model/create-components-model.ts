import { ComponentSchema, EntityId } from '@form-crafter/core'
import { isNotEmpty } from '@form-crafter/utils'
import { attach, combine, createEffect, createEvent, createStore, sample } from 'effector'
import { once } from 'patronum'

import { isConditionSuccessful } from '../../../../utils'
import { ThemeService } from '../../../theme'
import { ViewsService } from '../../../views'
import { ComponentToUpdate, GetExecutorContextBuilder, GetIsConditionSuccessfulChecker } from './types'
import { ComponentsModels } from './types'
import { buildExecutorContext, extractComponentsModels } from './utils'

type Params = {
    themeService: ThemeService
    viewsService: ViewsService
}

export type ComponentsModel = ReturnType<typeof createComponentsModel>

export const createComponentsModel = ({ themeService, viewsService }: Params) => {
    const $models = createStore<ComponentsModels>(new Map())

    const $componentsSchemas = combine($models, extractComponentsModels)

    const $viewComponentsSchemas = combine($componentsSchemas, viewsService.$currentViewComponents, (componentsSchemas, currentViewComponents) =>
        Object.fromEntries(Object.entries(componentsSchemas).filter(([componentId]) => currentViewComponents.has(componentId))),
    )

    const $getExecutorContextBuilder: GetExecutorContextBuilder = combine($componentsSchemas, viewsService.$curentViewId, (componentsSchemas, curentViewId) => {
        return (params) => buildExecutorContext({ componentsSchemas: params?.componentsSchemas || componentsSchemas, curentViewId })
    })

    const $getIsConditionSuccessfulChecker: GetIsConditionSuccessfulChecker = combine(
        $getExecutorContextBuilder,
        themeService.$operators,
        (getExecutorContextBuilder, operators) => (params) => {
            const ctx = params?.ctx || getExecutorContextBuilder()
            return ({ condition }) => isConditionSuccessful({ ctx, condition, operators })
        },
    )

    const initModels = createEvent<ComponentsModels>('init')
    const setModels = createEvent<ComponentsModels>('setModels')

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
                model.setSchemaEvent({ schema, isNewValue })
            }
            return map
        }, new Map(componentsModels))

        return Promise.resolve(newModel)
    })
    const updateModelsFx = attach({
        source: $models,
        mapParams: (componentsToUpdate: ComponentToUpdate[], componentsModels: ComponentsModels) => ({
            componentsModels,
            componentsToUpdate,
        }),
        effect: baseUpdateModelsFx,
    })

    const baseCreateComponentsFx = createEffect<
        {
            templates: ComponentSchema[]
            componentsModels: ComponentsModels
        },
        ComponentsModels
    >(({ componentsModels }) => {
        // TODO impl creating by templates
        return Promise.resolve(componentsModels)
    })
    const createComponentsFx = attach({
        source: $models,
        mapParams: (templates: ComponentSchema[], componentsModels: ComponentsModels) => ({
            templates,
            componentsModels,
        }),
        effect: baseCreateComponentsFx,
    })

    const baseRemoveComponentsFx = createEffect<
        {
            ids: Set<EntityId>
            componentsModels: ComponentsModels
        },
        ComponentsModels
    >(({ componentsModels }) => {
        // TODO impl removing
        return Promise.resolve(componentsModels)
    })
    const removeComponentsFx = attach({
        source: $models,
        mapParams: (ids: Set<EntityId>, componentsModels: ComponentsModels) => ({
            ids,
            componentsModels,
        }),
        effect: baseRemoveComponentsFx,
    })

    $models.on(setModels, (_, data) => data)

    sample({
        clock: once(initModels),
        target: setModels,
    })

    sample({
        clock: [updateModelsFx.doneData, createComponentsFx.doneData, removeComponentsFx.doneData],
        target: setModels,
    })

    const componentsAddedOrRemoved = sample({ clock: [once(initModels), createComponentsFx.doneData, removeComponentsFx.doneData] })

    return {
        updateModelsFx,
        initModels,
        componentsAddedOrRemoved,
        $models,
        $componentsSchemas,
        $viewComponentsSchemas,
        $getExecutorContextBuilder,
        $getIsConditionSuccessfulChecker,
    }
}
