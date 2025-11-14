import { EntityId, ViewDefinition, ViewsElementsGraphs } from '@form-crafter/core'
import { isNotEmpty, isNotNull } from '@form-crafter/utils'
import { combine, createEvent, createStore, sample, UnitValue } from 'effector'
import { readonly } from 'patronum'

import { ViewsServiceParams } from './types'
import { buildViewElementsGraphs, deepRemoveViewElement, mergeViewElementsGraph, selectViewByBreakpoint } from './utils'

export * from './types'

export { buildViewElementsGraphs }

export type ViewsService = ReturnType<typeof createViewsService>

export const createViewsService = ({ initial, generalService }: ViewsServiceParams) => {
    const $currentViewId = createStore<EntityId | null>(null)

    const $additionalViewsConditions = readonly(
        createStore<Pick<ViewDefinition, 'id' | 'condition'>[]>(Object.entries(initial.additionals || {}).map(([id, { condition }]) => ({ id, condition }))),
    )

    const $viewsElementsGraphs = createStore<ViewsElementsGraphs>(buildViewElementsGraphs(initial.default, initial.additionals || {}))

    const setViewsElementsGraphs = createEvent<UnitValue<typeof $viewsElementsGraphs>>('setViewsElementsGraphs')
    const removeRowElementDeep = createEvent<{ componentId: EntityId; rowIndex: number }>('removeRowElementDeep')
    const mergeViewsElementsGraphs = createEvent<{ graphsToMerge: UnitValue<typeof setViewsElementsGraphs>; rootComponentId: EntityId }>(
        'mergeViewsElementsGraphs',
    )
    const setCurrentViewId = createEvent<UnitValue<typeof $currentViewId>>('setCurrentViewId')

    $currentViewId.on(setCurrentViewId, (_, newId) => newId)
    $viewsElementsGraphs.on(setViewsElementsGraphs, (_, newGraphs) => newGraphs)

    const $currentViewElementsGraph = combine(
        $currentViewId,
        $viewsElementsGraphs,
        generalService.$currentBreakpoint,
        (currentViewId, viewsElementsGraphs, breakpoint) => {
            const isAdditionalView = isNotNull(currentViewId) && isNotEmpty(viewsElementsGraphs.additional)
            const finalViewResponsiveGraph = isAdditionalView ? viewsElementsGraphs.additional[currentViewId] : viewsElementsGraphs.default
            return selectViewByBreakpoint(breakpoint, finalViewResponsiveGraph)
        },
    )

    const $currentViewComponents = combine($currentViewElementsGraph, (currentViewElementsGraph) => new Set(Object.keys(currentViewElementsGraph.components)))

    sample({
        source: { viewsElementsGraphs: $viewsElementsGraphs },
        clock: mergeViewsElementsGraphs,
        fn: ({ viewsElementsGraphs }, { graphsToMerge, rootComponentId }) => {
            const newAdditional = Object.entries(viewsElementsGraphs.additional).reduce<ViewsElementsGraphs['additional']>(
                (result, [viewId, viewDetails]) => ({
                    ...result,
                    [viewId]: mergeViewElementsGraph({
                        responsiveViewElementsGraph: viewDetails,
                        responsiveViewToMerge: graphsToMerge.additional[viewId] || {},
                        rootComponentId,
                    }),
                }),
                {},
            )

            return {
                default: mergeViewElementsGraph({
                    responsiveViewElementsGraph: viewsElementsGraphs.default,
                    responsiveViewToMerge: graphsToMerge.default,
                    rootComponentId,
                }),
                additional: newAdditional,
            }
        },
        target: setViewsElementsGraphs,
    })

    const resultOfCalcRemoveRowElementDeep = sample({
        source: { viewsElementsGraphs: $viewsElementsGraphs },
        clock: removeRowElementDeep,
        fn: ({ viewsElementsGraphs }, { componentId, rowIndex }) => {
            const componentsIdsToRemove: EntityId[] = []

            const newAdditional = Object.entries(viewsElementsGraphs.additional).reduce<ViewsElementsGraphs['additional']>((result, [viewId, viewDetails]) => {
                const { viewElements, componentsIdsToRemove: idsToRemove } = deepRemoveViewElement({
                    responsiveViewElementsGraph: viewDetails,
                    parentComponentId: componentId,
                    rowIndex,
                })
                componentsIdsToRemove.push(...idsToRemove)
                return {
                    ...result,
                    [viewId]: viewElements,
                }
            }, {})

            const { viewElements: newDefault, componentsIdsToRemove: idsToRemove } = deepRemoveViewElement({
                responsiveViewElementsGraph: viewsElementsGraphs.default,
                parentComponentId: componentId,
                rowIndex,
            })
            componentsIdsToRemove.push(...idsToRemove)

            return {
                viewsElementsGraphs: {
                    default: newDefault,
                    additional: newAdditional,
                },
                componentsIdsToRemove: new Set(componentsIdsToRemove),
            }
        },
    })

    sample({
        clock: resultOfCalcRemoveRowElementDeep,
        fn: ({ viewsElementsGraphs }) => viewsElementsGraphs,
        target: setViewsElementsGraphs,
    })

    return {
        setCurrentViewId,
        mergeViewsElementsGraphs,
        removeRowElementDeep,
        resultOfCalcRemoveRowElementDeep,
        $currentViewId,
        $additionalViewsConditions,
        $currentViewElementsGraph,
        $currentViewComponents,
    }
}
