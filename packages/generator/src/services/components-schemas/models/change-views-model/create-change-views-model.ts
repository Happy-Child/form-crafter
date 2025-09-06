import { createEvent, sample } from 'effector'

import { ComponentToUpdate } from '../components-model'

type Params = {}

export type ChangeViewsModel = ReturnType<typeof createChangeViewsModel>

export const createChangeViewsModel = ({}: Params) => {
    const runChangeViewEvent = createEvent<ComponentToUpdate[]>('runChangeViewEvent')
    const runChangeViewGuardEvent = createEvent<ComponentToUpdate[]>('runChangeViewGuardEvent')

    sample({
        clock: runChangeViewGuardEvent,
        filter: (componentsToUpdate) => componentsToUpdate.some(({ isNewValue }) => !!isNewValue),
        fn: (componentsToUpdate) => componentsToUpdate.filter(({ isNewValue }) => !!isNewValue),
        target: runChangeViewEvent,
    })

    // sample({
    //     // source: {},
    //     clock: runChangeViewEvent,
    //     fn: (componentsToUpdate) => {

    //         return {}
    //     },
    //     target: ,
    // })

    return { runChangeViewEvent: runChangeViewGuardEvent }
}
