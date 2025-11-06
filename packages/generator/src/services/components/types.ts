import { ComponentsSchemas } from '@form-crafter/core'

import { AppErrorsService } from '../app-errors'
import { SchemaService } from '../schema'
import { ThemeService } from '../theme'
import { ViewsService } from '../views'

export type ComponentsServiceParams = {
    initial: ComponentsSchemas
    appErrorsService: AppErrorsService
    themeService: ThemeService
    viewsService: ViewsService
    schemaService: SchemaService
}
