import {
    ComponentSchema,
    ComponentsSchemas,
    ContainerComponentSchema,
    EntityId,
    RepeaterComponentSchema,
    ViewContent,
    ViewResponsive,
} from '@form-crafter/core'
import { genComponentId } from '@form-crafter/utils'

import { buildViewElementsGraphs } from '../../../../views'

type TemplateIdMap = Record<EntityId, EntityId>

// const replaceRootRowId = (viewResponsive: ViewResponsive) => {
//     Object.entries(viewResponsive).forEach(([, data]) => {
//         data.elements[]
//     })
// }

const createComponentsSchemasInstance = (
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
    const { schemas: newComponentsSchemas, componentIdMap } = createComponentsSchemasInstance(containerSchema, componentsSchemas)

    const viewElementsGraphs = buildViewElementsGraphs(views.default, views.additionals || {}, true, componentIdMap)

    return { componentsSchemas: newComponentsSchemas, viewElementsGraphs }
}
