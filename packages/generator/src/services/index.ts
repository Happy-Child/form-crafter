import { createAppErrorsService } from './app-errors'
import { createComponentsService } from './components'
import { createFormService } from './form'
import { createSchemaService } from './schema'
import { createThemeService } from './theme'
import { RootServicesParams } from './types'
import { createViewsService } from './views'

export type RootServices = ReturnType<typeof createRootServices>

export const createRootServices = ({ schema, theme, PlaceholderComponent, onSubmit }: RootServicesParams) => {
    const appErrorsService = createAppErrorsService()

    const themeService = createThemeService({ theme, PlaceholderComponent })

    const viewsService = createViewsService({ initial: schema.views })

    const schemaService = createSchemaService({ schema })

    const componentsService = createComponentsService({
        initial: schema.componentsSchemas,
        appErrorsService,
        themeService,
        viewsService,
        schemaService,
    })

    const formService = createFormService({ onSubmit, viewsService, componentsService })

    const bootstrap = () => {
        componentsService.initService()
    }

    bootstrap()

    return {
        schemaService,
        componentsService,
        viewsService,
        formService,
        themeService,
        appErrorsService,
    }
}
