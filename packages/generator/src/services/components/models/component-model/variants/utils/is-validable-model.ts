import { ComponentModel, EditableModel, RepeaterModel, UploaderModel } from '@form-crafter/core'

import { isEditableModel } from '../editable-model'
import { isRepeaterModel } from '../repeater-model'

export const isValidableModel = (model: ComponentModel): model is EditableModel | RepeaterModel | UploaderModel =>
    isEditableModel(model) || isRepeaterModel(model)
