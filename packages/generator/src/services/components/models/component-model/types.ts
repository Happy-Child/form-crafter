import { ComponentSchema, ComponentsValidationErrorsModel, ReadyConditionalValidationsModel, RunMutationsOnUserActionPayload } from '@form-crafter/core'
import { EventCallable } from 'effector'

import { SchemaService } from '../../../schema'
import { ThemeService } from '../../../theme'
import { ComponentsRegistryModel } from '../components-registry-model'

export type ComponentModelParams = {
    runMutations: EventCallable<RunMutationsOnUserActionPayload>
    schema: ComponentSchema
    themeService: ThemeService
    schemaService: SchemaService
    componentsRegistryModel: ComponentsRegistryModel
    readyConditionalValidationsModel: ReadyConditionalValidationsModel
    componentsValidationErrorsModel: ComponentsValidationErrorsModel
}
