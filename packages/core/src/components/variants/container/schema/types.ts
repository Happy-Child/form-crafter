import { AvailableObject, Nullable } from '@form-crafter/utils'

import { ComponentMeta, GeneralComponentSchema } from '../../../schema'

export type ContainerComponentProperties = AvailableObject & { title?: Nullable<string> }

export type ContainerComponentSchema<T extends ContainerComponentProperties = ContainerComponentProperties> = GeneralComponentSchema & {
    meta: ComponentMeta<'container'>
    properties: T
}
