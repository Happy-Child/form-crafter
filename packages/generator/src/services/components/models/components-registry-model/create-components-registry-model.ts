import { ComponentsModels, EntityId, GetComponentsByTemplateDepFn, GetExecutorContextBuilder, GetIsConditionSuccessfulChecker } from '@form-crafter/core'
import { AvailableObject } from '@form-crafter/utils'
import { combine, createEvent, createStore, sample } from 'effector'
import { readonly } from 'patronum'

import { ThemeService } from '../../../theme'
import { ViewsService } from '../../../views'
import { createComponentsStoreModel, createComponentsTemplatesModel } from './models'
import { ChildrenOfComponents } from './types'
import { buildChildrenComponentsGraph, buildExecutorContext, getComponentsByTemplateDep, isConditionSuccessful } from './utils'

type Params = {
    themeService: Pick<ThemeService, '$operators'>
    viewsService: Pick<ViewsService, '$currentViewId' | '$currentViewComponents' | '$currentViewElementsGraph'>
    initialValues?: AvailableObject
}

export type ComponentsRegistryModel = ReturnType<typeof createComponentsRegistryModel>

export const createComponentsRegistryModel = ({ viewsService, themeService, initialValues }: Params) => {
    const init = createEvent<ComponentsModels>('init')

    const setHiddenComponents = createEvent<Set<EntityId>>('setHiddenComponents')
    const $hiddenComponents = createStore<Set<EntityId>>(new Set()).on(setHiddenComponents, (_, newComponentsToHidden) => newComponentsToHidden)

    const runCalcChildrenOfComponents = createEvent('runCalcChildrenOfComponents')
    const setChildrenOfComponents = createEvent<ChildrenOfComponents>('setChildrenOfComponents')
    const $childrenOfComponents = createStore<ChildrenOfComponents>({}).on(setChildrenOfComponents, (_, newData) => newData)

    const componentsStoreModel = createComponentsStoreModel({ init })

    const componentsTemplatesModel = createComponentsTemplatesModel({ componentsStoreModel })

    const $currentViewVisibleComponentsSchemas = combine(
        componentsStoreModel.$componentsSchemas,
        viewsService.$currentViewComponents,
        $hiddenComponents,
        (componentsSchemas, currentViewComponents, hiddenComponents) =>
            Object.fromEntries(
                Object.entries(componentsSchemas).filter(([componentId]) => currentViewComponents.has(componentId) && !hiddenComponents.has(componentId)),
            ),
    )

    const $getExecutorContextBuilder: GetExecutorContextBuilder = combine(
        componentsStoreModel.$componentsSchemas,
        viewsService.$currentViewId,
        (componentsSchemas, currentViewId) => {
            return (params) => buildExecutorContext({ componentsSchemas: params?.componentsSchemas || componentsSchemas, currentViewId })
        },
    )

    const $getComponentsByTemplateDep: GetComponentsByTemplateDepFn = combine(
        $childrenOfComponents,
        componentsTemplatesModel.$templates,
        viewsService.$currentViewElementsGraph,
        (childrenOfComponents, componentsTemplatesMap, currentViewElementsGraph) =>
            ({ ownerComponentId }) =>
            (depTemplateId) =>
                getComponentsByTemplateDep({ childrenOfComponents, componentsTemplatesMap, ownerComponentId, depTemplateId, currentViewElementsGraph }),
    )

    const $getIsConditionSuccessfulChecker: GetIsConditionSuccessfulChecker = combine(
        $getExecutorContextBuilder,
        $getComponentsByTemplateDep,
        themeService.$operators,
        (getExecutorContextBuilder, getComponentsByTemplateDep, operators) => (params) => {
            const ctx = params?.ctx || getExecutorContextBuilder()
            return ({ condition, ownerComponentId }) =>
                isConditionSuccessful({ ctx, condition, operators, getComponentsByTemplateDep: getComponentsByTemplateDep({ ownerComponentId }) })
        },
    )

    sample({
        source: {
            componentsSchemas: componentsStoreModel.$componentsSchemas,
            componentsTemplates: componentsTemplatesModel.$templates,
            currentViewElementsGraph: viewsService.$currentViewElementsGraph,
        },
        clock: runCalcChildrenOfComponents,
        fn: ({ componentsSchemas, componentsTemplates, currentViewElementsGraph }) =>
            buildChildrenComponentsGraph(componentsSchemas, currentViewElementsGraph, componentsTemplates.componentIdToTemplateId),
        target: setChildrenOfComponents,
    })

    $childrenOfComponents.watch((data) => console.log('data: ', data))

    return {
        init,
        runCalcChildrenOfComponents,
        componentsStoreModel,
        componentsTemplatesModel,
        $hiddenComponents: readonly($hiddenComponents),
        $getExecutorContextBuilder: readonly($getExecutorContextBuilder),
        $getIsConditionSuccessfulChecker: readonly($getIsConditionSuccessfulChecker),
        $currentViewVisibleComponentsSchemas: readonly($currentViewVisibleComponentsSchemas),
        $childrenOfComponents: readonly($childrenOfComponents),
    }
}
