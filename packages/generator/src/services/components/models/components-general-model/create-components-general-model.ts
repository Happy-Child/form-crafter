import { EntityId } from '@form-crafter/core'
import { createEvent, createStore } from 'effector'
import { readonly } from 'patronum'

export type ComponentsGeneralModel = ReturnType<typeof createComponentsGeneralModel>

export const createComponentsGeneralModel = () => {
    const $hiddenComponents = createStore<Set<EntityId>>(new Set())

    const setHiddenComponents = createEvent<Set<EntityId>>('setHiddenComponents')

    $hiddenComponents.on(setHiddenComponents, (_, newComponentsToHidden) => newComponentsToHidden)

    return {
        setHiddenComponents,
        $hiddenComponents: readonly($hiddenComponents),
    }
}
