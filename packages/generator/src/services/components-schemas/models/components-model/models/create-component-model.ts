import { isContainerComponentSchema, isEditableComponentSchema, isRepeaterComponentSchema } from '@form-crafter/core'

import { type ComponentModel, createContainerModel, createEditableModel, createRepeaterModel, createStaticModel } from './components'
import { ComponentModelParams } from './types'

export const createComponentModel = ({ schema, ...args }: ComponentModelParams): ComponentModel => {
    if (isEditableComponentSchema(schema)) {
        return createEditableModel({ schema, ...args })
    }

    if (isContainerComponentSchema(schema)) {
        return createContainerModel({ schema, ...args })
    }

    if (isRepeaterComponentSchema(schema)) {
        return createRepeaterModel({ schema, ...args })
    }

    return createStaticModel({ schema, ...args })
}
