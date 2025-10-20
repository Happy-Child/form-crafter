import { AvailableObject } from '@form-crafter/utils'
import { Effect, EventCallable, StoreWritable } from 'effector'

import { GeneratorProps } from '../../types'
import { ComponentsService } from '../components'
import { ViewsService } from '../views'

export type InvokeUserSubmitHandlerData = Parameters<GeneratorProps['onSubmit']>[0]

export type FormService = {
    $userSubmitHandler: StoreWritable<GeneratorProps['onSubmit']>
    invokeUserSubmitHandlerFx: Effect<InvokeUserSubmitHandlerData, void, Error>
    onFormSubmitEvent: EventCallable<void>
}

export type FormServiceParams = {
    componentsService: ComponentsService
    viewsService: ViewsService
    onSubmit: (schema: AvailableObject) => void
}
