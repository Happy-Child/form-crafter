import { ComponentSchemaModel, EditableSchemaModel } from '../../types'

export const isRepeaterSchemaModel = (model: ComponentSchemaModel): model is EditableSchemaModel => {
    const schema = model.$schema.getState()
    return schema.meta.type === 'repeater'
}
