import { ComponentSchemaModel, EditableSchemaModel } from 'packages/generator/src/types'

export const isUploaderSchemaModel = (model: ComponentSchemaModel): model is EditableSchemaModel => {
    const schema = model.$schema.getState()
    return schema.meta.type === 'uploader'
}
