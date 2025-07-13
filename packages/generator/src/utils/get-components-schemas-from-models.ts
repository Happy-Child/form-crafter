import { ComponentsSchemas } from '@form-crafter/core'

import { SchemaMap } from '../types'

export const getComponentsSchemasFromModels = (componentsSchemasModel: SchemaMap) =>
    Object.entries(Object.fromEntries(componentsSchemasModel)).reduce<ComponentsSchemas>(
        (obj, [componentId, data]) => ({ ...obj, [componentId]: data.$schema.getState() }),
        {},
    )
