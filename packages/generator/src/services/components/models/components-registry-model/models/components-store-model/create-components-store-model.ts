import { ComponentsModels, ComponentToUpdate, EntityId } from '@form-crafter/core'
import { isNotEmpty } from '@form-crafter/utils'
import { attach, combine, createEffect, createEvent, createStore, EventCallable, sample } from 'effector'
import { combineEvents, once, readonly } from 'patronum'

import { extractComponentsModels } from './utils'

type Params = {
    init: EventCallable<ComponentsModels>
}

export type ComponentsStoreModel = ReturnType<typeof createComponentsStoreModel>

export const createComponentsStoreModel = ({ init }: Params) => {
    const $models = createStore<ComponentsModels>(new Map())

    const addComponentsModels = createEvent<ComponentsModels>('addComponentsModels')
    const removeComponentsModels = createEvent<Set<EntityId>>('removeComponentsModels')
    const setComponentsModels = createEvent<ComponentsModels>('setComponentsModels')

    const $componentsSchemas = combine($models, extractComponentsModels)

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
        source: $models,
        mapParams: (componentsToUpdate: ComponentToUpdate[], componentsModels: ComponentsModels) => ({
            componentsModels,
            componentsToUpdate,
        }),
        effect: baseUpdateModelsFx,
    })

    $models.on(setComponentsModels, (_, models) => models)

    sample({
        clock: [updateComponentsModelsFx.doneData],
        target: setComponentsModels,
    })

    sample({
        clock: once(init),
        target: setComponentsModels,
    })

    sample({
        source: { componentsModels: $models },
        clock: addComponentsModels,
        fn: ({ componentsModels: currentModels }, newModels) =>
            Array.from(newModels.entries()).reduce((result, [componentId, model]) => {
                result.set(componentId, model)
                return result
            }, new Map(currentModels)),
        target: setComponentsModels,
    })

    sample({
        source: { componentsModels: $models },
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
            combineEvents([once(init), $models.updates]),
            combineEvents([addComponentsModels, $models.updates]),
            combineEvents([removeComponentsModels, $models.updates]),
        ],
    })

    const componentsAdded = sample({
        clock: [combineEvents([addComponentsModels, $models.updates])],
    })

    return {
        updateComponentsModelsFx,
        addComponentsModels,
        removeComponentsModels,
        componentsAddedOrRemoved,
        componentsAdded,
        $models: readonly($models),
        $componentsSchemas: readonly($componentsSchemas),
    }
}
