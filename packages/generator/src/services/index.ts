import { createAppErrorsService } from './app-errors'
import { createComponentsService } from './components'
import { createFormService } from './form'
import { createGeneralService } from './general'
import { init } from './init'
import { createRepeaterService } from './repeater'
import { createSchemaService } from './schema'
import { createThemeService } from './theme'
import { RootServicesParams } from './types'
import { createViewsService } from './views'

export type RootServices = ReturnType<typeof createRootServices>

export const createRootServices = ({ schema, initialValues, theme, PlaceholderComponent, onSubmit }: RootServicesParams) => {
    const appErrorsService = createAppErrorsService()

    const generalService = createGeneralService()

    const schemaService = createSchemaService({ schema })

    const themeService = createThemeService({ theme, PlaceholderComponent })

    const viewsService = createViewsService({ initial: schema.views, generalService })

    const componentsService = createComponentsService({
        initialValues,
        appErrorsService,
        themeService,
        viewsService,
        schemaService,
    })

    const repeaterService = createRepeaterService({
        componentsService,
    })

    const formService = createFormService({ onSubmit, viewsService, componentsService })

    init({
        viewsService,
        componentsService,
        repeaterService,
    })

    return {
        appErrorsService,
        generalService,
        schemaService,
        viewsService,
        componentsService,
        repeaterService,
        formService,
        themeService,
    }
}
