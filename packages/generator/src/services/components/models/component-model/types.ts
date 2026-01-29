import { ComponentSchema, ComponentsValidationErrorsModel, ReadyConditionalValidationsModel, RunMutationsOnUserActionPayload } from '@form-crafter/core'
import { EventCallable } from 'effector'

import { SchemaService } from '../../../schema'
import { ThemeService } from '../../../theme'
import { ComponentsRegistryModel } from '../components-registry-model'

export type ComponentModelParams = {
    schema: ComponentSchema
    runMutations: EventCallable<RunMutationsOnUserActionPayload>
    themeService: ThemeService
    schemaService: SchemaService
    componentsRegistryModel: ComponentsRegistryModel
    componentsValidationErrorsModel: ComponentsValidationErrorsModel
    readyConditionalValidationsModel: ReadyConditionalValidationsModel
}
