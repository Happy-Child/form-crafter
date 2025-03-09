import { SerializableValue } from '@form-crafter/utils'

import { EntityId } from '../types'

export type Condition = {
    componentId: EntityId
    operatorName: string
    value: SerializableValue
}
