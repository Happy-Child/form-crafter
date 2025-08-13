import { Effect, EventCallable, sample } from 'effector'

import { GeneratorProps } from '../../types'
import { FormServiceParams } from './types'

type Params = Pick<FormServiceParams, 'componentsSchemasService' | 'viewsService'> & {
    invokeUserSubmitHandlerFx: Effect<Parameters<GeneratorProps['onSubmit']>[0], void, Error>
    onFormSubmitEvent: EventCallable<void>
}

export const init = ({ onFormSubmitEvent, invokeUserSubmitHandlerFx, componentsSchemasService }: Params) => {
    sample({
        clock: onFormSubmitEvent,
        target: componentsSchemasService.formValidationModel.runFormValidationFx,
    })

    sample({
        source: {
            componentsIsValid: componentsSchemasService.formValidationModel.$formIsValid,
            visibleComponentsSchemas: componentsSchemasService.visabilityComponentsModel.$visibleComponentsSchemas,
        },
        clock: componentsSchemasService.formValidationModel.runFormValidationFx.done,
        filter: ({ componentsIsValid }) => componentsIsValid,
        fn: ({ visibleComponentsSchemas }) => visibleComponentsSchemas,
        target: invokeUserSubmitHandlerFx,
    })

    sample({
        clock: componentsSchemasService.formValidationModel.runFormValidationFx.fail,
        fn: console.log,
    })
}
