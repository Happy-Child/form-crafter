import { createComponentsSchemasService } from './components-schemas'
import { createFormService } from './form'
import { createRepeaterService } from './repeater'
import { createSchemaService } from './schema'
import { createThemeService } from './theme'
import { RootServices, RootServicesParams } from './types'
import { createViewsService } from './views'

export const createRootServices = ({ schema, theme, PlaceholderComponent, onSubmit }: RootServicesParams): RootServices => {
    const themeService = createThemeService({ theme, PlaceholderComponent })

    const schemaService = createSchemaService(schema)

    const componentsSchemasService = createComponentsSchemasService({ initial: schema.componentsSchemas, themeService, schemaService })

    const viewsService = createViewsService({ initial: schema.views })

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
    }
}
