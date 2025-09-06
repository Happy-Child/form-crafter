import { Maybe } from '@form-crafter/utils'

import { ComponentSchema, RepeaterComponentSchema } from '..'

export const isRepeaterComponentSchema = (schema: Maybe<ComponentSchema>): schema is RepeaterComponentSchema => {
    return schema?.meta?.type === 'repeater'
}
