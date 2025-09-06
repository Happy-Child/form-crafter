import { isNotEmpty, Maybe } from '@form-crafter/utils'

import { ComponentSchema, EditableComponentSchema, editableComponentTypes } from '..'

export const isEditableComponentSchema = (schema: Maybe<ComponentSchema>): schema is EditableComponentSchema => {
    return isNotEmpty(schema) ? editableComponentTypes.includes(schema.meta.type) : false
}
