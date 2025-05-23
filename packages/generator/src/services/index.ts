import { createComponentsSchemasService } from './components-schemas'
import { createFormService } from './form'
import { createRepeaterService } from './repeater'
import { createSchemaService } from './schema'
import { createThemeService } from './theme'
import { RootServices, RootServicesParams } from './types'
import { createViewsService } from './views'

export const createRootServices = ({ schema, theme, PlaceholderComponent, onSubmit }: RootServicesParams): RootServices => {
    const themeService = createThemeService({ theme, PlaceholderComponent })
    const schemaService = createSchemaService({ layout: schema.layout })
    const componentsSchemasService = createComponentsSchemasService({ initial: schema.componentsSchemas, themeService })
    const viewsService = createViewsService({ initial: schema.views })

    const formService = createFormService({ onSubmit, viewsService, componentsSchemasService })
    const repeaterService = createRepeaterService({ viewsService, componentsSchemasService })

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
        themeService,
        repeaterService,
    }
}
