import { Maybe } from '@form-crafter/utils'

import { ComponentSchema, RepeaterComponentSchema } from '../components'

export const isRepeaterComponentSchema = (schema: Maybe<ComponentSchema>): schema is RepeaterComponentSchema => {
    return schema?.meta?.type === 'repeater'
}
