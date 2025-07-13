import { ComponentsSchemas, EntityId, RuleExecutorContext } from '@form-crafter/core'

type Params = {
    componentsSchemas: ComponentsSchemas
}

export const buildExecutorContext = ({ componentsSchemas }: Params): RuleExecutorContext => ({
    getComponentSchemaById: (componentId: EntityId) => {
        const schema = componentsSchemas[componentId] || null
        return !schema?.visability?.hidden ? schema : null
    },
    getRepeaterChildIds: (componentId: EntityId) => {
        console.log(componentId)
        return []
    },
    isTemplateComponentId: (componentId: EntityId) => {
        console.log(componentId)
        return false
    },
})
