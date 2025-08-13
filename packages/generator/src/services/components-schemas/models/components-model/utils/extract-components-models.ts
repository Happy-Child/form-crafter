import { ComponentsSchemas } from '@form-crafter/core'

import { ComponentsModels } from '../types'

export const extractComponentsModels = (componentsModels: ComponentsModels) =>
    Object.entries(Object.fromEntries(componentsModels)).reduce<ComponentsSchemas>(
        (obj, [componentId, data]) => ({ ...obj, [componentId]: data.$schema.getState() }),
        {},
    )
