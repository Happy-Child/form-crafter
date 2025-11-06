import { ComponentsModels, ComponentsSchemas } from '@form-crafter/core'

export const extractComponentsModels = (componentsModels: ComponentsModels) =>
    Object.entries(Object.fromEntries(componentsModels)).reduce<ComponentsSchemas>(
        (obj, [componentId, data]) => ({ ...obj, [componentId]: data.$schema.getState() }),
        {},
    )
