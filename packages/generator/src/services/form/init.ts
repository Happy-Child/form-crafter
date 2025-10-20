import { Effect, EventCallable, sample } from 'effector'

import { GeneratorProps } from '../../types'
import { FormServiceParams } from './types'

type Params = Pick<FormServiceParams, 'componentsService' | 'viewsService'> & {
    invokeUserSubmitHandlerFx: Effect<Parameters<GeneratorProps['onSubmit']>[0], void, Error>
    onFormSubmitEvent: EventCallable<void>
}

export const init = ({ onFormSubmitEvent, invokeUserSubmitHandlerFx, componentsService }: Params) => {
    sample({
        clock: onFormSubmitEvent,
        target: componentsService.formValidationModel.runFormValidationFx,
    })

    sample({
        source: {
            componentsIsValid: componentsService.formValidationModel.$formIsValid,
            currentViewVisibleComponentsSchemas: componentsService.componentsModel.$currentViewVisibleComponentsSchemas,
        },
        clock: componentsService.formValidationModel.runFormValidationFx.done,
        filter: ({ componentsIsValid }) => componentsIsValid,
        fn: ({ currentViewVisibleComponentsSchemas }) => currentViewVisibleComponentsSchemas,
        target: invokeUserSubmitHandlerFx,
    })

    sample({
        clock: componentsService.formValidationModel.runFormValidationFx.fail,
        fn: (data) => console.warn('runFormValidationFx.fail: ', data),
    })
}
