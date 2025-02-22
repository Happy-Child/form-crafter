import { Effect, EventCallable, sample } from 'effector'

import { GeneratorProps } from '../../types'
import { FormServiceParams } from './types'

type Params = Pick<FormServiceParams, 'componentsSchemasService' | 'viewsService'> & {
    invokeUserSubmitHandlerFx: Effect<Parameters<GeneratorProps['onSubmit']>[0], void, Error>
    onFormSubmitEvent: EventCallable<void>
}

export const init = ({ onFormSubmitEvent, invokeUserSubmitHandlerFx, componentsSchemasService, viewsService }: Params) => {
    sample({
        source: { componentsSchemas: componentsSchemasService.$schemas, views: viewsService.$views },
        clock: onFormSubmitEvent,
        fn: ({ views, componentsSchemas }) => {
            return {
                views,
                componentsSchemas,
            }
        },
        target: invokeUserSubmitHandlerFx,
    })
}
