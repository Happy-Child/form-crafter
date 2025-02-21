import { createEvent } from 'effector'

import { init } from './init'
import { AddDynamicContainerChildPayload, DynamicContainerParams, DynamicContainerService, RemoveDynamicContainerChildPayload } from './types'

export const createDynamicContainerService = ({ componentsSchemasService, viewsService }: DynamicContainerParams): DynamicContainerService => {
    const addDynamicContainerChildEvent = createEvent<AddDynamicContainerChildPayload>('addDynamicContainerChildEvent')

    const removeDynamicContainerChildEvent = createEvent<RemoveDynamicContainerChildPayload>('removeDynamicContainerChildEvent')

    init({
        componentsSchemasService,
        viewsService,
        addDynamicContainerChildEvent,
        removeDynamicContainerChildEvent,
    })

    return {
        addDynamicContainerChildEvent,
        removeDynamicContainerChildEvent,
    }
}
