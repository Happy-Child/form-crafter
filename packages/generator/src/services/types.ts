import { Schema } from '@form-crafter/core'

import { ComponentsSchemasService } from './components-schemas'
import { FormService } from './form'
import { RepeaterService } from './repeater'
import { SchemaService } from './schema'
import { ThemeService, ThemeServiceParams } from './theme'
import { ViewsService } from './views'

export type RootServicesParams = ThemeServiceParams & {
    schema: Schema
    onSubmit: (schema: Schema) => void
}

export type RootServices = {
    schemaService: SchemaService
    componentsSchemasService: ComponentsSchemasService
    viewsService: ViewsService
    formService: FormService
    repeaterService: RepeaterService
    themeService: ThemeService
}
