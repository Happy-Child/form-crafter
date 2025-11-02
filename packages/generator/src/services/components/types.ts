import { ComponentsSchemas, EntityId } from '@form-crafter/core'
import { AvailableObject } from '@form-crafter/utils'

import { AppErrorsService } from '../app-errors'
import { SchemaService } from '../schema'
import { ThemeService } from '../theme'
import { ViewsService } from '../views'

export type RunMutationsOnUserActionsPayload = { id: EntityId; data: AvailableObject }

export type ComponentsServiceParams = {
    initial: ComponentsSchemas
    appErrorsService: AppErrorsService
    themeService: ThemeService
    viewsService: ViewsService
    schemaService: SchemaService
}
