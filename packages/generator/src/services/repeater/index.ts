import { createEvent } from 'effector'

import { init } from './init'
import { AddChildPayload, RemoveChildPayload, RepeaterService, RepeaterServiceParams } from './types'

export type { RepeaterService }

export const createRepeaterService = ({ componentsService, viewsService }: RepeaterServiceParams): RepeaterService => {
    const addChildEvent = createEvent<AddChildPayload>('addChildEvent')

    const removeChildEvent = createEvent<RemoveChildPayload>('removeChildEvent')

    init({
        componentsService,
        viewsService,
        addChildEvent,
        removeChildEvent,
    })

    return {
        addChildEvent,
        removeChildEvent,
    }
}
