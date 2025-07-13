import { Schema } from '@form-crafter/core'
import { OptionalSerializableObject } from '@form-crafter/utils'

import { ComponentsSchemasService } from './components-schemas'
import { FormService } from './form'
import { RepeaterService } from './repeater'
import { SchemaService } from './schema'
import { ThemeService, ThemeServiceParams } from './theme'
import { ViewsService } from './views'

export type RootServicesParams = ThemeServiceParams & {
    schema: Schema
    onSubmit: (schema: OptionalSerializableObject) => void
}

export type RootServices = {
    schemaService: SchemaService
    componentsSchemasService: ComponentsSchemasService
    viewsService: ViewsService
    formService: FormService
    repeaterService: RepeaterService
    themeService: ThemeService
}
