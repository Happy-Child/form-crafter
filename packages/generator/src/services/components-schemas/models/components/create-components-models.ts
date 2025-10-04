import { isContainerComponentSchema, isEditableComponentSchema, isRepeaterComponentSchema } from '@form-crafter/core'

import { ComponentsModels } from '../components-model'
import { createContainerModel } from './container-model'
import { createEditableModel } from './editable-model'
import { createRepeaterModel } from './repeater-model'
import { createStaticModel } from './static-model'
import { ComponentModel, ComponentModelParams } from './types'

const createComponentModel = ({ schema, ...args }: ComponentModelParams): ComponentModel => {
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

type Params = Omit<ComponentModelParams, 'schema'>

export const createComponentsModels = (params: Params) =>
    Object.entries(params.schemaService.$initialSchema.getState().componentsSchemas).reduce<ComponentsModels>((map, [componentId, componentSchema]) => {
        const model = createComponentModel({
            ...params,
            schema: componentSchema,
        })
        map.set(componentId, model)
        return map
    }, new Map())
