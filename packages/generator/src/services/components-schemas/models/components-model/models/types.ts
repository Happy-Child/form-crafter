import { ComponentSchema } from '@form-crafter/core'
import { EventCallable } from 'effector'

import { SchemaService } from '../../../../schema'
import { ThemeService } from '../../../../theme'
import { RunMutationsOnUserActionsPayload } from '../../../types'
import { ComponentsValidationErrorsModel } from '../../components-validation-errors-model'
import { ReadyConditionalValidationsModel } from '../../ready-conditional-validations-model'
import { GetExecutorContextBuilder } from '../types'

export type ComponentModelParams = {
    $getExecutorContextBuilder: GetExecutorContextBuilder
    runMutationsEvent: EventCallable<RunMutationsOnUserActionsPayload>
    readyConditionalValidationsModel: ReadyConditionalValidationsModel
    componentsValidationErrorsModel: ComponentsValidationErrorsModel
    themeService: ThemeService
    schemaService: SchemaService
    schema: ComponentSchema
}
