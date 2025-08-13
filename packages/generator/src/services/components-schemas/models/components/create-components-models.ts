import {
    ComponentsSchemas,
    isContainerComponentSchema,
    isEditableComponentSchema,
    isRepeaterComponentSchema,
    isUploaderComponentSchema,
} from '@form-crafter/core'

import { ComponentsModels } from '../components-model'
import { createContainerModel } from './container-model'
import { createEditableModel } from './editable-model'
import { createRepeaterModel } from './repeater-model'
import { createStaticModel } from './static-model'
import { ComponentModel, ComponentModelParams } from './types'
import { createUploaderModel } from './uploader-model'

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

    if (isUploaderComponentSchema(schema)) {
        return createUploaderModel({ schema, ...args })
    }

    return createStaticModel({ schema, ...args })
}

type Params = Omit<ComponentModelParams, 'schema'> & {
    initialComponentsSchemas: ComponentsSchemas
}

export const createComponentsModels = ({ initialComponentsSchemas, ...params }: Params) =>
    Object.entries(initialComponentsSchemas).reduce<ComponentsModels>((map, [componentId, componentSchema]) => {
        const model = createComponentModel({
            ...params,
            schema: componentSchema,
        })
        map.set(componentId, model)
        return map
    }, new Map())
