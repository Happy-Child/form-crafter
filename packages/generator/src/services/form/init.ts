import { Effect, EventCallable, sample } from 'effector'

import { GeneratorProps } from '../../types'
import { extractComponentsSchemasModels } from '../components-schemas/components-models'
import { FormServiceParams } from './types'

type Params = Pick<FormServiceParams, 'componentsSchemasService' | 'viewsService'> & {
    invokeUserSubmitHandlerFx: Effect<Parameters<GeneratorProps['onSubmit']>[0], void, Error>
    onFormSubmitEvent: EventCallable<void>
}

export const init = ({ onFormSubmitEvent, invokeUserSubmitHandlerFx, componentsSchemasService }: Params) => {
    sample({
        clock: onFormSubmitEvent,
        target: componentsSchemasService.runFormValidationFx,
    })

    sample({
        source: { componentsIsValid: componentsSchemasService.$formIsValid, componentsSchemasModel: componentsSchemasService.$componentsSchemasModel },
        clock: componentsSchemasService.runFormValidationFx.done,
        filter: ({ componentsIsValid }) => componentsIsValid,
        fn: ({ componentsSchemasModel }) => {
            const componentsSchemas = extractComponentsSchemasModels(componentsSchemasModel)
            return {
                componentsSchemas,
            }
        },
        target: invokeUserSubmitHandlerFx,
    })

    sample({
        clock: componentsSchemasService.runFormValidationFx.fail,
        fn: console.log,
    })
}
