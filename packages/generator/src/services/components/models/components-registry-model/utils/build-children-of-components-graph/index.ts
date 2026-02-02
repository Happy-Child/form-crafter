import { ComponentsSchemas, EntityId, ViewElementsGraph } from '@form-crafter/core'
import { isNotEmpty, isNull } from '@form-crafter/utils'
import { invert, pick } from 'lodash-es'

import { ComponentsTemplates } from '../../models/components-templates-model'
import { ChildrenOfComponents, ChildrenOfContainer, ChildrenOfRepeater } from '../../types'

const getEmptyChildOfContainer = (): ChildrenOfContainer => ({
    type: 'container',
    children: new Set(),
    childrenByTemplateId: {},
})

const getEmptyChildOfRepeater = (): ChildrenOfRepeater => ({
    type: 'repeater',
    children: new Set(),
    childrenByTemplateId: {},
})

export const buildChildrenComponentsGraph = (
    compsSchemas: ComponentsSchemas,
    currentViewElementsGraph: ViewElementsGraph,
    componentIdToTemplateId: ComponentsTemplates['componentIdToTemplateId'],
): ChildrenOfComponents => {
    const childrenOfComponents: ChildrenOfComponents = {}

    const isContainer = (componentId: EntityId) => compsSchemas[componentId].meta.type === 'container'

    const getChildrenByTemplateId = (childrenComponents: EntityId[]) => {
        if (!isNotEmpty(componentIdToTemplateId)) {
            return {}
        }
        return invert(pick(componentIdToTemplateId, childrenComponents))
    }

    const runBuild = (parentComponentId: EntityId | null, rowsIds: EntityId[]) => {
        rowsIds.forEach((rowId) => {
            const { childrenComponents } = currentViewElementsGraph.rows.graph[rowId]

            if (isNotEmpty(childrenComponents) && !isNull(parentComponentId)) {
                let finalData: ChildrenOfComponents[keyof ChildrenOfComponents]

                if (isContainer(parentComponentId)) {
                    const childrenByTemplateId = getChildrenByTemplateId(childrenComponents)
                    const containerResult = (childrenOfComponents[parentComponentId] as ChildrenOfContainer) || getEmptyChildOfContainer()

                    finalData = {
                        type: 'container',
                        children: new Set([...childrenComponents, ...containerResult.children]),
                        childrenByTemplateId: { ...containerResult.childrenByTemplateId, ...childrenByTemplateId },
                    }
                } else {
                    const childrenByTemplateId = getChildrenByTemplateId(childrenComponents)
                    const repeaterResult = (childrenOfComponents[parentComponentId] as ChildrenOfRepeater) || getEmptyChildOfRepeater()

                    const previousChildrenByTemplate = Object.values(repeaterResult.childrenByTemplateId)?.[0] || []
                    const templateId = Object.keys(childrenByTemplateId)[0]

                    const finalChildrenByTemplateId = {
                        [templateId]: [...previousChildrenByTemplate, ...Object.values(childrenByTemplateId)],
                    }

                    finalData = {
                        type: 'repeater',
                        children: new Set([...childrenComponents, ...repeaterResult.children]),
                        childrenByTemplateId: finalChildrenByTemplateId,
                    }
                }

                childrenOfComponents[parentComponentId] = finalData
            }

            childrenComponents.forEach((componentId: EntityId) => {
                const { childrenRows } = currentViewElementsGraph.components[componentId]

                if (!isNotEmpty(childrenRows)) {
                    return
                }

                runBuild(componentId, childrenRows)
            })
        })
    }

    runBuild(null, currentViewElementsGraph.rows.root)

    return childrenOfComponents
}
