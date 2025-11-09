import { ComponentSchema, ComponentsSchemas, ContainerComponentSchema, EntityId, RepeaterComponentSchema } from '@form-crafter/core'
import { genComponentId, genId } from '@form-crafter/utils'

import { buildViewElementsGraphs } from '../../../../views'

type TemplateIdMap = Record<EntityId, EntityId>

const replaceComponentsSchemasIds = (
    containerSchema: ContainerComponentSchema,
    componentsSchemas: RepeaterComponentSchema['template']['componentsSchemas'],
) => {
    const schemas: ComponentsSchemas = {}
    const componentIdMap: TemplateIdMap = {}

    const containerTemplateId = containerSchema.meta.id
    const containerComponentId = genComponentId(containerTemplateId)
    schemas[containerComponentId] = {
        ...containerSchema,
        meta: { ...containerSchema.meta, templateId: containerTemplateId, id: containerComponentId },
    }
    componentIdMap[containerTemplateId] = containerComponentId

    Object.entries(componentsSchemas).forEach(([templateId, schema]) => {
        const id = genComponentId(templateId)
        const newSchema = {
            ...schema,
            meta: { ...schema.meta, templateId, id },
        } as ComponentSchema

        schemas[id] = newSchema
        componentIdMap[templateId] = id
    })

    return { schemas, componentIdMap, containerComponentId }
}

export const createTemplateInstance = ({ views, containerSchema, componentsSchemas }: RepeaterComponentSchema['template']) => {
    const { schemas: newComponentsSchemas, componentIdMap } = replaceComponentsSchemasIds(containerSchema, componentsSchemas)

    const rowIdMap: TemplateIdMap = {}
    const viewElementsGraphs = buildViewElementsGraphs(views.default, views.additionals, {
        getComponentId: (id) => componentIdMap[id],
        getRowId: (id) => {
            if (id in rowIdMap) {
                return rowIdMap[id]
            }
            const newRowId = genId()
            rowIdMap[id] = newRowId
            return newRowId
        },
    })

    return { viewElementsGraphs, componentsSchemas: newComponentsSchemas }
}
