import { ComponentSchema, ComponentsSchemas, ContainerComponentSchema, EntityId, RepeaterComponentSchema } from '@form-crafter/core'
import { genComponentId } from '@form-crafter/utils'

import { buildViewElementsGraphs } from '../../../../views'

type TemplateIdMap = Record<EntityId, EntityId>

// const createViewDefinition = (definitionTemplate: ViewDefinition, componentsIdMap: componentIdMap, repeaterId: EntityId): ViewDefinition => {
//     const rowIdsMap: componentIdMap = {}

//     const rows = Object.fromEntries(
//         Object.entries(definitionTemplate.responsive.xxl).map(([templateRowId, row]): [EntityId, ViewRow] => {
//             const newRowId = genRowId()
//             rowIdsMap[templateRowId] = newRowId

//             const children = row.children.map(({ id: templateComponentId }) => ({
//                 id: componentsIdMap[templateComponentId],
//             }))

//             return [
//                 newRowId,
//                 {
//                     ...row,
//                     id: newRowId,
//                     children,
//                 },
//             ]
//         }),
//     )

//     const components = Object.fromEntries(
//         Object.entries(definitionTemplate.components).map(([templateComponentId, component]): [EntityId, ViewComponent] => {
//             const isRootComponent = templateComponentId === rootComponentId
//             const parentId = isRootComponent ? repeaterId : componentsIdMap[component.parentId!]

//             const finalId = componentsIdMap[templateComponentId]
//             const rows = component.rows?.map(({ id: templateRowId }) => ({
//                 id: rowIdsMap[templateRowId],
//             }))

//             return [
//                 finalId,
//                 {
//                     ...component,
//                     id: finalId,
//                     parentId,
//                     rows,
//                 },
//             ]
//         }),
//     )

//     return {
//         rows,
//         components,
//     }
// }

const createComponentsSchemasInstance = (
    containerSchema: ContainerComponentSchema,
    componentsSchemas: RepeaterComponentSchema['template']['componentsSchemas'],
) => {
    const schemas: ComponentsSchemas = {}
    const componentIdMap: TemplateIdMap = {}

    const containerTemplateId = containerSchema.meta.id
    const containerComponentId = `${containerTemplateId}-${genComponentId(containerSchema.meta.name)}`
    schemas[containerComponentId] = {
        ...containerSchema,
        meta: { ...containerSchema.meta, templateId: containerTemplateId, id: containerComponentId },
    }
    componentIdMap[containerTemplateId] = containerComponentId

    Object.entries(componentsSchemas).forEach(([templateId, schema]) => {
        const id = `${templateId}-${genComponentId(schema.meta.name)}`
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

    const viewElementsGraphs = buildViewElementsGraphs(views.default, views.additionals || {}, componentIdMap)

    return { componentsSchemas: newComponentsSchemas, viewElementsGraphs }
}
