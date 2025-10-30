import { attach, createEvent, createStore } from 'effector'

import { GeneratorProps } from '../../types'
import { init } from './init'
import { FormServiceParams, InvokeUserSubmitHandlerData } from './types'

export type FormService = ReturnType<typeof createFormService>

export const createFormService = ({ onSubmit, componentsService, viewsService }: FormServiceParams) => {
    const $userSubmitHandler = createStore<GeneratorProps['onSubmit']>(onSubmit)

    const invokeUserSubmitHandlerFx = attach({
        source: $userSubmitHandler,
        effect: (handler, data: InvokeUserSubmitHandlerData) => {
            handler!(data)
        },
    })

    const onFormSubmit = createEvent('onFormSubmit')

    init({ onFormSubmit, invokeUserSubmitHandlerFx, componentsService, viewsService })

    return {
        $userSubmitHandler,
        invokeUserSubmitHandlerFx,
        onFormSubmit,
    }
}
