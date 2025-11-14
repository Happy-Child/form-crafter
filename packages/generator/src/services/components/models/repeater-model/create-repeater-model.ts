import { RepeaterComponentSchema } from '@form-crafter/core'
import { createEvent, sample } from 'effector'

import { ComponentsRegistryModel } from '../components-registry-model'
import { AddGroupPayload, RemoveGroupPayload } from './types'
import { createTemplateInstance } from './utils'

type Params = {
    componentsRegistryModel: ComponentsRegistryModel
}

export type RepeaterModel = ReturnType<typeof createRepeaterModel>

export const createRepeaterModel = ({ componentsRegistryModel }: Params) => {
    const addGroup = createEvent<AddGroupPayload>('addGroup')
    const removeGroup = createEvent<RemoveGroupPayload>('removeGroup')

    const startCreateTemplateInstance = sample({
        source: { componentsSchemas: componentsRegistryModel.$componentsSchemas },
        clock: addGroup,
        fn: ({ componentsSchemas }, { repeaterId }) => {
            const { template } = componentsSchemas[repeaterId] as RepeaterComponentSchema
            return { template, repeaterId }
        },
    })

    const groupToAdd = sample({
        clock: startCreateTemplateInstance,
        fn: ({ template, repeaterId }) => {
            const { viewElementsGraphs, componentsSchemas: newComponentsSchemas } = createTemplateInstance(template)
            return {
                rootComponentId: repeaterId,
                viewElementsGraphs,
                componentsSchemas: newComponentsSchemas,
            }
        },
    })

    const groupToRemove = sample({
        clock: removeGroup,
        fn: (params) => params,
    })

    return {
        addGroup,
        removeGroup,
        groupToAdd,
        groupToRemove,
    }
}
