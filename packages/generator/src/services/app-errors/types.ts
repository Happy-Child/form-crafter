import { EventCallable, StoreWritable } from 'effector'

export type AppErrorItem = {
    id: string
    message?: string
}

export type AppErrorsService = {
    $errors: StoreWritable<AppErrorItem[]>
    addErrorEvent: EventCallable<AppErrorItem>
}
