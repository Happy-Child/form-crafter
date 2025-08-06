import { ComponentSchemaModel, EditableSchemaModel } from '../../types'

export const isEditableSchemaModel = (model: ComponentSchemaModel): model is EditableSchemaModel => {
    const schema = model.$schema.getState()
    return schema.meta.type === 'editable'
}
