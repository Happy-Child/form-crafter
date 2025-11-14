import { createAppErrorsService } from './app-errors'
import { createComponentsService } from './components'
import { createFormService } from './form'
import { createGeneralService } from './general'
import { init } from './init'
import { createSchemaService } from './schema'
import { createThemeService } from './theme'
import { RootServicesParams } from './types'
import { createViewsService } from './views'

export type RootServices = ReturnType<typeof createRootServices>

export const createRootServices = ({ schema, theme, PlaceholderComponent, onSubmit }: RootServicesParams) => {
    const generalService = createGeneralService()

    const appErrorsService = createAppErrorsService()

    const themeService = createThemeService({ theme, PlaceholderComponent })

    const viewsService = createViewsService({ initial: schema.views, generalService })

    const schemaService = createSchemaService({ schema })

    const componentsService = createComponentsService({
        initial: schema.componentsSchemas,
        appErrorsService,
        themeService,
        viewsService,
        schemaService,
    })

    const formService = createFormService({ onSubmit, viewsService, componentsService })

    init({
        componentsService,
    })

    return {
        generalService,
        appErrorsService,
        schemaService,
        componentsService,
        viewsService,
        formService,
        themeService,
    }
}
