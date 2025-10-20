import { ComponentsSchemas, EntityId } from '@form-crafter/core'
import { AvailableObject } from '@form-crafter/utils'
import { EventCallable } from 'effector'

import { AppErrorsService } from '../app-errors'
import { SchemaService } from '../schema'
import { ThemeService } from '../theme'
import { ViewsService } from '../views'
import { ComponentsModel } from './models/components-model'
import { DepsOfRulesModel } from './models/deps-of-rules-model'
import { FormValidationModel } from './models/form-validation-model'

export type RunMutationsOnUserActionsPayload = { id: EntityId; data: AvailableObject }

export type ComponentsService = {
    componentsModel: ComponentsModel
    formValidationModel: FormValidationModel
    initServiceEvent: EventCallable<void>
    depsOfRulesModel: DepsOfRulesModel
    updateComponentsSchemasEvent: EventCallable<ComponentsSchemas>
    removeComponentsSchemasByIdsEvent: EventCallable<{ ids: EntityId[] }>
}

export type ComponentsServiceParams = {
    initial: ComponentsSchemas
    appErrorsService: AppErrorsService
    themeService: ThemeService
    viewsService: ViewsService
    schemaService: SchemaService
}
