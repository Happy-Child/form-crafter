import { ComponentsTemplates, EntityId, ViewElementsGraph } from '@form-crafter/core'
import { isEmpty, isNotEmpty } from '@form-crafter/utils'

import { ChildrenOfComponents } from '../../types'
import { getInstancesWithinContainer } from '../get-instances-within-container'

type Params = {
    childrenOfComponents: ChildrenOfComponents
    componentsTemplatesMap: ComponentsTemplates
    depTemplateId: EntityId
    currentViewElementsGraph: ViewElementsGraph
    ownerComponentId?: EntityId
}

export const getInstancesByTemplateDep = ({
    childrenOfComponents,
    componentsTemplatesMap,
    ownerComponentId,
    depTemplateId,
    currentViewElementsGraph,
}: Params): EntityId[] => {
    const allInstancesDepTemplate = Array.from(componentsTemplatesMap.templateIdToComponentsIds[depTemplateId])

    if (isEmpty(ownerComponentId)) {
        return allInstancesDepTemplate
    }

    const isChildren = (containerId: EntityId, componentId: EntityId) => {
        if (containerId in childrenOfComponents) {
            return childrenOfComponents[containerId].children.has(componentId)
        }
        return false
    }

    const parentOwnerRowId = currentViewElementsGraph.components[ownerComponentId].parentRowId
    const parentOwnerComponentId = currentViewElementsGraph.rows.graph[parentOwnerRowId].parentComponentId

    if (isEmpty(parentOwnerComponentId)) {
        return allInstancesDepTemplate
    }

    //     const ownerComponentIsContainer = ownerComponentId in childrenOfComponents
    //     const depTemplateAsNeghtbour = childrenOfComponents[parentOwnerComponentId].childrenByTemplateId[depTemplateId]

    //     if (ownerComponentIsContainer) {
    //         const instancesWithinContainer = getInstancesWithinContainer({childrenOfComponents, containerId: ownerComponentId, targetTemplateId: depTemplateId})
    //         return isNotEmpty(instancesWithinContainer) ? instancesWithinContainer : allInstancesDepTemplate
    //     } else if (isNotEmpty(depTemplateAsNeghtbour)) {
    //         return depTemplateAsNeghtbour
    //     } else if () {
    //         // Реализовать parentOwnerComponentId === depTemplateId. depTemplateAsNeghtbour - не шаблон.

    //     }

    //     if (isChildren(parentComp, depId)) {
    //     return все экземпляры depId в рамках parentComp
    // }

    return allInstancesDepTemplate
}
