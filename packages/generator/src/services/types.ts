import { Schema } from '@form-crafter/core'
import { AvailableObject } from '@form-crafter/utils'

import { AppErrorsService } from './app-errors'
import { ComponentsService } from './components'
import { FormService } from './form'
import { RepeaterService } from './repeater'
import { SchemaService } from './schema'
import { ThemeService, ThemeServiceParams } from './theme'
import { ViewsService } from './views'

export type RootServicesParams = ThemeServiceParams & {
    schema: Schema
    onSubmit: (schema: AvailableObject) => void
}

export type RootServices = {
    schemaService: SchemaService
    componentsService: ComponentsService
    viewsService: ViewsService
    formService: FormService
    repeaterService: RepeaterService
    themeService: ThemeService
    appErrorsService: AppErrorsService
}
