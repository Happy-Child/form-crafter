import { createEvent, createStore } from 'effector'

import { AppErrorItem } from './types'

export type AppErrorsService = ReturnType<typeof createAppErrorsService>

export const createAppErrorsService = () => {
    const $errors = createStore<AppErrorItem[]>([])

    const addError = createEvent<AppErrorItem>('addError')

    $errors.on(addError, (prev, newError) => [...prev, newError])

    return {
        $errors,
        addError,
    }
}
