import { ComponentSchemaModel, EditableSchemaModel, RepeaterSchemaModel, UploaderSchemaModel } from 'packages/generator/src/types'

import { isEditableSchemaModel } from './is-editable-schema-model'
import { isRepeaterSchemaModel } from './is-repeater-schema-model'
import { isUploaderSchemaModel } from './is-uploader-schema-model'

export const isValidableSchemaModel = (model: ComponentSchemaModel): model is EditableSchemaModel | RepeaterSchemaModel | UploaderSchemaModel =>
    isEditableSchemaModel(model) || isRepeaterSchemaModel(model) || isUploaderSchemaModel(model)
