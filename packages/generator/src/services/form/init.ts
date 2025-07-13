import { Effect, EventCallable, sample } from 'effector'

import { GeneratorProps } from '../../types'
import { getComponentsSchemasFromModels } from '../../utils'
import { FormServiceParams } from './types'

type Params = Pick<FormServiceParams, 'componentsSchemasService' | 'viewsService'> & {
    invokeUserSubmitHandlerFx: Effect<Parameters<GeneratorProps['onSubmit']>[0], void, Error>
    onFormSubmitEvent: EventCallable<void>
}

export const init = ({ onFormSubmitEvent, invokeUserSubmitHandlerFx, componentsSchemasService, viewsService }: Params) => {
    sample({
        source: { schemasMap: componentsSchemasService.$schemasMap, views: viewsService.$views },
        clock: onFormSubmitEvent,
        fn: ({ views, schemasMap }) => {
            const componentsSchemas = getComponentsSchemasFromModels(schemasMap)
            // TODO преобразовать в { key: value by key }
            return {
                views,
                componentsSchemas,
            }
        },
        target: invokeUserSubmitHandlerFx,
    })
}
