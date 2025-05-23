import { Maybe } from '@form-crafter/utils'

import { ComponentSchema, StaticComponentSchema } from '../components'

export const isStaticComponentSchema = (schema: Maybe<ComponentSchema>): schema is StaticComponentSchema => {
    return schema?.meta?.type === 'static'
}
