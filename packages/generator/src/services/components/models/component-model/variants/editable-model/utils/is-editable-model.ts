import { ComponentModel, editableComponentTypes, EditableModel } from '@form-crafter/core'

export const isEditableModel = (model: ComponentModel): model is EditableModel => {
    const schema = model.$schema.getState()
    return editableComponentTypes.includes(schema.meta.type)
}
