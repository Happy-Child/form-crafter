import { Effect, EventCallable, sample } from 'effector'

import { GeneratorProps } from '../../types'
import { extractComponentsSchemasModels } from '../../utils'
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
        source: { componentsIsValid: componentsSchemasService.$componentsIsValid, schemasMap: componentsSchemasService.$schemasMap },
        clock: componentsSchemasService.runFormValidationFx.done,
        filter: ({ componentsIsValid }) => componentsIsValid,
        fn: ({ schemasMap }) => {
            const componentsSchemas = extractComponentsSchemasModels(schemasMap)
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
