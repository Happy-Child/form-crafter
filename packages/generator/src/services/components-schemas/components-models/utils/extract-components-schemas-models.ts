import { ComponentsSchemas } from '@form-crafter/core'

import { ComponentsSchemasModel } from '../types'

export const extractComponentsSchemasModels = (componentsSchemasModel: ComponentsSchemasModel) =>
    Object.entries(Object.fromEntries(componentsSchemasModel)).reduce<ComponentsSchemas>(
        (obj, [componentId, data]) => ({ ...obj, [componentId]: data.$schema.getState() }),
        {},
    )
