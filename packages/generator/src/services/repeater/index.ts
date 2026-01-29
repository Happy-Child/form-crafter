import { RepeaterComponentSchema } from '@form-crafter/core'
import { createEvent, sample } from 'effector'

import { ComponentsService } from '../components'
import { AddRepeaterGroupPayload, RemoveRepeaterGroupPayload } from './types'
import { createTemplateInstance } from './utils'

type RepeaterServiceParams = {
    componentsService: { componentsRegistryModel: Pick<ComponentsService['componentsRegistryModel'], 'componentsStoreModel'> }
}

export type RepeaterService = ReturnType<typeof createRepeaterService>

export const createRepeaterService = ({ componentsService }: RepeaterServiceParams) => {
    const generateGroup = createEvent<AddRepeaterGroupPayload>('addGroup')
    const removeGroup = createEvent<RemoveRepeaterGroupPayload>('removeGroup')

    const generateGroupWithPayload = sample({
        source: { componentsSchemas: componentsService.componentsRegistryModel.componentsStoreModel.$componentsSchemas },
        clock: generateGroup,
        fn: ({ componentsSchemas }, { repeaterId }) => {
            const { template } = componentsSchemas[repeaterId] as RepeaterComponentSchema
            return { template, repeaterId }
        },
    })

    const groupGenerated = sample({
        clock: generateGroupWithPayload,
        fn: ({ template, repeaterId }) => {
            const { viewElementsGraphs, componentsSchemas: newComponentsSchemas } = createTemplateInstance(template)
            return {
                rootComponentId: repeaterId,
                viewElementsGraphs,
                componentsSchemas: newComponentsSchemas,
            }
        },
    })

    return {
        generateGroup,
        removeGroup,
        groupGenerated,
    }
}
