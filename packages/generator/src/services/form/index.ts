import { attach, createEvent, createStore } from 'effector'

import { GeneratorProps } from '../../types'
import { init } from './init'
import { FormService, FormServiceParams, InvokeUserSubmitHandlerData } from './types'

export const createFormService = ({ onSubmit }: FormServiceParams): FormService => {
    const $userSubmitHandler = createStore<GeneratorProps['onSubmit']>(onSubmit)

    const invokeUserSubmitHandlerFx = attach({
        source: $userSubmitHandler,
        effect: (handler, data: InvokeUserSubmitHandlerData) => {
            handler!(data)
        },
    })

    const onFormSubmitEvent = createEvent('onFormSubmitEvent')

    init({})

    return {
        $userSubmitHandler,
        invokeUserSubmitHandlerFx,
        onFormSubmitEvent,
    }
}
