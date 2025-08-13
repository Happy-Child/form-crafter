import { ComponentsSchemas, EntityId } from '@form-crafter/core'
import { OptionalSerializableObject } from '@form-crafter/utils'
import { EventCallable } from 'effector'

import { SchemaService } from '../schema'
import { ThemeService } from '../theme'
import { ComponentsModel } from './models/components-model'
import { FormValidationModel } from './models/form-validation-model'
import { VisabilityComponentsModel } from './models/visability-components-model'

export type RunMutationsRulesOnUserActionsPayload = { id: EntityId; data: OptionalSerializableObject }

export type ComponentsSchemasService = {
    componentsModel: ComponentsModel
    visabilityComponentsModel: VisabilityComponentsModel
    formValidationModel: FormValidationModel
    initServiceEvent: EventCallable<void>
    updateComponentsSchemasEvent: EventCallable<ComponentsSchemas>
    removeComponentsSchemasByIdsEvent: EventCallable<{ ids: EntityId[] }>
}

export type ComponentsSchemasServiceParams = {
    initial: ComponentsSchemas
    themeService: ThemeService
    schemaService: SchemaService
}
