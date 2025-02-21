// import { createEvent, sample } from 'effector'

import { createComponentsSchemasService } from './components-schemas'
import { createDynamicContainerService } from './dynamic-container'
import { createFormService } from './form'
import { createSchemaService } from './schema'
import { RootServices, RootServicesParams } from './types'
import { createViewsService } from './views'

export const createRootServices = ({ schema, onSubmit }: RootServicesParams): RootServices => {
    const schemaService = createSchemaService({ layout: schema.layout })
    const componentsSchemasService = createComponentsSchemasService({ initial: schema.componentsSchemas })
    const viewsService = createViewsService({ initial: schema.views })

    const formService = createFormService({ onSubmit })
    const dynamicContainerService = createDynamicContainerService({ viewsService, componentsSchemasService })

    // const setTestComponentHidden = createEvent<any>()

    // // Подписка на изменения схем
    // sample({
    //     clock: componentsSchemasService.$schemas,
    //     fn: (schemas) => schemas['input-first-name'].properties.value === 'Поехали',
    //     target: setTestComponentHidden,
    // })

    // // Отдельно обновляем hidden, но только если значение реально поменялось
    // sample({
    //     clock: setTestComponentHidden,
    //     source: componentsSchemasService.$schemas,
    //     filter: (schemas, hidden) => {
    //         console.log('cur:', schemas.testComp.hidden, 'new: ', hidden)
    //         return schemas.testComp.hidden !== hidden
    //     }, // Предотвращаем повторное обновление
    //     fn: (schemas, hidden) => ({
    //         ...schemas,
    //         testComp: {
    //             ...schemas.testComp,
    //             hidden,
    //         },
    //     }),
    //     target: componentsSchemasService.$schemas,
    // })

    return {
        schemaService,
        componentsSchemasService,
        viewsService,
        formService,
        dynamicContainerService,
    }
}
