import { Maybe } from '@form-crafter/utils'

import { ComponentSchema, EditableComponentSchema } from '../components'

export const isEditableComponentSchema = (schema: Maybe<ComponentSchema>): schema is EditableComponentSchema => {
    return schema?.meta?.type === 'editable'
}
