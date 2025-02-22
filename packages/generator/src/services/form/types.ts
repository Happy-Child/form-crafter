import { Schema } from '@form-crafter/core'
import { Effect, EventCallable, StoreWritable } from 'effector'

import { GeneratorProps } from '../../types'
import { ComponentsSchemasService } from '../components-schemas'
import { ViewsService } from '../views'

export type InvokeUserSubmitHandlerData = Parameters<GeneratorProps['onSubmit']>[0]

export type FormService = {
    $userSubmitHandler: StoreWritable<GeneratorProps['onSubmit']>
    invokeUserSubmitHandlerFx: Effect<InvokeUserSubmitHandlerData, void, Error>
    onFormSubmitEvent: EventCallable<void>
}

export type FormServiceParams = {
    componentsSchemasService: ComponentsSchemasService
    viewsService: ViewsService
    onSubmit: (schema: Schema) => void
}
