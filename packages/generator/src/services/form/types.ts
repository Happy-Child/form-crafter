import { Schema } from '@form-crafter/core'
import { Effect, EventCallable, StoreWritable } from 'effector'

import { GeneratorProps } from '../../types'

export type InvokeUserSubmitHandlerData = Parameters<GeneratorProps['onSubmit']>[0]

export type FormService = {
    $userSubmitHandler: StoreWritable<GeneratorProps['onSubmit']>
    invokeUserSubmitHandlerFx: Effect<InvokeUserSubmitHandlerData, void, Error>
    onFormSubmitEvent: EventCallable<void>
}

export type FormServiceParams = {
    onSubmit: (schema: Schema) => void
}
