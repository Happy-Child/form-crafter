import { isEditableModel } from '../editable-model'
import { isRepeaterModel } from '../repeater-model'
import { ComponentModel, EditableModel, RepeaterModel, UploaderModel } from '../types'
import { isUploaderModel } from '../uploader-model'

export const isValidableModel = (model: ComponentModel): model is EditableModel | RepeaterModel | UploaderModel =>
    isEditableModel(model) || isRepeaterModel(model) || isUploaderModel(model)
