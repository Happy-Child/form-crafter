import { editableComponentTypes } from '@form-crafter/core'

import { ComponentModel, EditableModel } from '../../types'

export const isEditableModel = (model: ComponentModel): model is EditableModel => {
    const schema = model.$schema.getState()
    return editableComponentTypes.includes(schema.meta.type)
}
