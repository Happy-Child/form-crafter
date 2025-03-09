import {
    ComponentSchema,
    ComponentsSchemas,
    EntityId,
    RepeaterComponentSchema,
    rootComponentId,
    ViewComponent,
    ViewDefinition,
    ViewRow,
    ViewsDefinitions,
} from '@form-crafter/core'

import { genComponentId, genRowId } from '../../../utils'

type IdMap = Record<EntityId, EntityId>

const createViewDefinition = (definitionTemplate: ViewDefinition, componentsIdMap: IdMap, repeaterId: EntityId): ViewDefinition => {
    const rowIdsMap: IdMap = {}

    const rows = Object.fromEntries(
        Object.entries(definitionTemplate.rows).map(([templateRowId, row]): [EntityId, ViewRow] => {
            const newRowId = genRowId()
            rowIdsMap[templateRowId] = newRowId

            const children = row.children.map(({ id: templateComponentId }) => ({
                id: componentsIdMap[templateComponentId],
            }))

            return [
                newRowId,
                {
                    ...row,
                    id: newRowId,
                    children,
                },
            ]
        }),
    )

    const components = Object.fromEntries(
        Object.entries(definitionTemplate.components).map(([templateComponentId, component]): [EntityId, ViewComponent] => {
            const isRootComponent = templateComponentId === rootComponentId
            const parentId = isRootComponent ? repeaterId : componentsIdMap[component.parentId!]

            const finalId = componentsIdMap[templateComponentId]
            const rows = component.rows?.map(({ id: templateRowId }) => ({
                id: rowIdsMap[templateRowId],
            }))

            return [
                finalId,
                {
                    ...component,
                    id: finalId,
                    parentId,
                    rows,
                },
            ]
        }),
    )

    return {
        rows,
        components,
    }
}

type CreateNewComponentsSchemas = {
    schemas: ComponentsSchemas
    templateIdMap: IdMap
}

const createNewComponentsSchemas = (componentsSchemas: RepeaterComponentSchema['template']['componentsSchemas']): CreateNewComponentsSchemas => {
    const schemas: ComponentsSchemas = {}
    const templateIdMap: CreateNewComponentsSchemas['templateIdMap'] = {}

    Object.entries(componentsSchemas).forEach(([templateId, schema]) => {
        const newId = genComponentId(schema.meta.name)
        const newSchema = {
            ...schema,
            meta: { ...schema.meta, templateId, id: newId },
        } as ComponentSchema

        schemas[newId] = newSchema
        templateIdMap[templateId] = newId
    })

    return { schemas, templateIdMap }
}

type CreateViewsDefinitions = {
    views: ViewsDefinitions
    componentsSchemas: ComponentsSchemas
    additionalRowId: EntityId
}

export const createViewsDefinitions = ({ views, componentsSchemas }: RepeaterComponentSchema['template'], repeaterId: EntityId): CreateViewsDefinitions => {
    const { schemas: newComponentsSchemas, templateIdMap: templateComponentIdMap } = createNewComponentsSchemas(componentsSchemas)

    const additionalViewRow: ViewRow = {
        id: genRowId(),
        children: [{ id: templateComponentIdMap[rootComponentId] }],
    }

    const finalViews = Object.fromEntries(
        Object.entries(views).map(([viewId, definition]) => {
            const def = createViewDefinition(definition, templateComponentIdMap, repeaterId)
            def.rows[additionalViewRow.id] = additionalViewRow
            return [viewId, def]
        }),
    )

    return { views: finalViews, componentsSchemas: newComponentsSchemas, additionalRowId: additionalViewRow.id }
}
