import { AvailableObject } from '@form-crafter/utils'

import { AppErrorsService } from '../app-errors'
import { SchemaService } from '../schema'
import { ThemeService } from '../theme'
import { ViewsService } from '../views'

export type ComponentsServiceParams = {
    initialValues?: AvailableObject
    appErrorsService: AppErrorsService
    themeService: ThemeService
    viewsService: ViewsService
    schemaService: SchemaService
}
