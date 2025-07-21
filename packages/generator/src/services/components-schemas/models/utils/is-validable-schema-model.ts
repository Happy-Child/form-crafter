import { ComponentSchemaModel, EditableSchemaModel, RepeaterSchemaModel, UploaderSchemaModel } from '../../../../types'
import { isEditableSchemaModel } from '../editable-schema-model'
import { isRepeaterSchemaModel } from '../repeater-schema-model'
import { isUploaderSchemaModel } from '../uploader-schema-model'

export const isValidableSchemaModel = (model: ComponentSchemaModel): model is EditableSchemaModel | RepeaterSchemaModel | UploaderSchemaModel =>
    isEditableSchemaModel(model) || isRepeaterSchemaModel(model) || isUploaderSchemaModel(model)
