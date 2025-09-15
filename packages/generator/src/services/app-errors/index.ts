import { createEvent, createStore } from 'effector'

import { AppErrorItem, AppErrorsService } from './types'

export type { AppErrorsService }

export const createAppErrorsService = (): AppErrorsService => {
    const $errors = createStore<AppErrorItem[]>([])

    const addErrorEvent = createEvent<AppErrorItem>('addErrorEvent')

    $errors.on(addErrorEvent, (prev, newError) => [...prev, newError])

    return {
        $errors,
        addErrorEvent,
    }
}
