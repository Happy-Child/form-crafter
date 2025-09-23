import { createAppErrorsService } from './app-errors'
import { createComponentsSchemasService } from './components-schemas'
import { createFormService } from './form'
import { createRepeaterService } from './repeater'
import { createSchemaService } from './schema'
import { createThemeService } from './theme'
import { RootServices, RootServicesParams } from './types'
import { createViewsService } from './views'

export const createRootServices = ({ schema, theme, PlaceholderComponent, onSubmit }: RootServicesParams): RootServices => {
    const appErrorsService = createAppErrorsService()

    const themeService = createThemeService({ theme, PlaceholderComponent })

    const viewsService = createViewsService({ initial: schema.views })

    const schemaService = createSchemaService({ schema })

    const componentsSchemasService = createComponentsSchemasService({
        initial: schema.componentsSchemas,
        appErrorsService,
        themeService,
        viewsService,
        schemaService,
    })

    const repeaterService = createRepeaterService({ viewsService, componentsSchemasService })

    const formService = createFormService({ onSubmit, viewsService, componentsSchemasService })

    const bootstrap = () => {
        componentsSchemasService.initServiceEvent()
    }

    bootstrap()

    return {
        schemaService,
        componentsSchemasService,
        viewsService,
        formService,
        themeService,
        repeaterService,
        appErrorsService,
    }
}
