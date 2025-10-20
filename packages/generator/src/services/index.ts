import { createAppErrorsService } from './app-errors'
import { createComponentsService } from './components'
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

    const componentsService = createComponentsService({
        initial: schema.componentsSchemas,
        appErrorsService,
        themeService,
        viewsService,
        schemaService,
    })

    const repeaterService = createRepeaterService({ viewsService, componentsService })

    const formService = createFormService({ onSubmit, viewsService, componentsService })

    const bootstrap = () => {
        componentsService.initServiceEvent()
    }

    bootstrap()

    return {
        schemaService,
        componentsService,
        viewsService,
        formService,
        themeService,
        repeaterService,
        appErrorsService,
    }
}
