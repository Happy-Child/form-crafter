import { ComponentModel, isContainerComponentSchema, isEditableComponentSchema, isRepeaterComponentSchema } from '@form-crafter/core'

import { ComponentModelParams } from './types'
import { createContainerModel, createEditableModel, createRepeaterModel, createStaticModel } from './variants'

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
