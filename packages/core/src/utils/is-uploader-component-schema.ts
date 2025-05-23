import { Maybe } from '@form-crafter/utils'

import { ComponentSchema, UploaderComponentSchema } from '../components'

export const isUploaderComponentSchema = (schema: Maybe<ComponentSchema>): schema is UploaderComponentSchema => {
    return schema?.meta?.type === 'uploader'
}
