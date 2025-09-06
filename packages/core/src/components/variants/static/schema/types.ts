import { AvailableObject } from '@form-crafter/utils'

import { ComponentMeta, GeneralComponentSchema } from '../../../schema'

export type StaticComponentProperties = AvailableObject

export type StaticComponentSchema<T extends StaticComponentProperties = StaticComponentProperties> = GeneralComponentSchema & {
    meta: ComponentMeta<'static'>
    properties: T
}
