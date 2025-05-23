import { Maybe } from '@form-crafter/utils'

import { ComponentSchema, ContainerComponentSchema } from '../components'

export const isContainerComponentSchema = (schema: Maybe<ComponentSchema>): schema is ContainerComponentSchema => {
    return schema?.meta?.type === 'container'
}
