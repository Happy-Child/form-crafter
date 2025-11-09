import { ComponentsSchemas, EntityId, RuleExecutorContext } from '@form-crafter/core'

type Params = {
    componentsSchemas: ComponentsSchemas
    currentViewId: string | null
}

export const buildExecutorContext = ({ componentsSchemas, currentViewId }: Params): RuleExecutorContext => ({
    getComponentSchemaById: (componentId: EntityId) => {
        const schema = componentsSchemas[componentId] || null
        return !schema?.visability?.hidden ? schema : null
    },
    getCurrentView: () => currentViewId,
    getRepeaterChildIds: (componentId: EntityId) => {
        console.log(componentId)
        return []
    },
    isTemplateComponentId: (componentId: EntityId) => {
        console.log(componentId)
        return false
    },
})
