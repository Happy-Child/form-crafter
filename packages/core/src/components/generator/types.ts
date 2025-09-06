import { AvailableObject } from '@form-crafter/utils'

import { EntityId } from '../../types'
import { ComponentMeta, ValidationRuleSchema } from '../schema'
import { ComponentType } from '../types'

export type ComponentValidationError = Pick<ValidationRuleSchema, 'id' | 'key'> & {
    message: string
}

export type GroupValidationError = ComponentValidationError

export type GeneratorComponentProps<T extends ComponentType, P extends AvailableObject> = {
    meta: ComponentMeta<T>
    properties: P
    id: EntityId
    parentId: EntityId
    rowId: EntityId
}
