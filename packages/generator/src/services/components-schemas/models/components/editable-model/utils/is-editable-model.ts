import { ComponentModel, EditableModel } from '../../types'

export const isEditableModel = (model: ComponentModel): model is EditableModel => {
    const schema = model.$schema.getState()
    return schema.meta.type === 'editable'
}
