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

export const getComponentsByTemplateDep = ({
    childrenOfComponents,
    componentsTemplatesMap,
    ownerComponentId,
    depTemplateId,
    currentViewElementsGraph,
}: Params): EntityId[] => {
    const allComponentsDepTemplate = Array.from(componentsTemplatesMap.templateIdToComponentsIds[depTemplateId])

    // Кейс 1: нет компонента на котором вызывается условие для правила - значит это правила смены view.
    if (isEmpty(ownerComponentId)) {
        return allComponentsDepTemplate
    }

    const parentOwnerRowId = currentViewElementsGraph.components[ownerComponentId].parentRowId
    const parentOwnerComponentId = currentViewElementsGraph.rows.graph[parentOwnerRowId].parentComponentId

    // Кейс 2: вызываем условие на компоненте 0-ого уровня вложенности, тогда не важны отношеня depTemplate с каким-либо компонентов - возвращаем всей экземпляры шаблона.
    if (!isNotEmpty(parentOwnerComponentId)) {
        return allComponentsDepTemplate
    }

    const ownerComponentIsContainer = ownerComponentId in childrenOfComponents

    // Кейсы 3, 4, 5: owner - компонент контейнер
    // 3: Если в рамках owner контейнера есть хотя бы один экземпляр - возвращаем их.
    // 4: Иначе возвращаем все экземпляры шаблона.
    // 5: Когда owner-ом является компонент 0-ого уровня вложенности - вернём все экземпляры компонента в рамках всей формы, т.к. это не шаблон контейнера компонента repeater.
    if (ownerComponentIsContainer) {
        const componentsByTemplateWithinContainer = getInstancesWithinContainer({
            childrenOfComponents,
            containerId: ownerComponentId,
            targetTemplateId: depTemplateId,
        })
        return isNotEmpty(componentsByTemplateWithinContainer) ? componentsByTemplateWithinContainer : allComponentsDepTemplate
    }

    // Кейс 6: выбран сосед как зависимость - оба шаблоны. Возвращается id экземпляра зависимости.
    const componentByTemplateWithinParentContainer = childrenOfComponents[parentOwnerComponentId].childrenByTemplateId[depTemplateId]
    if (isNotEmpty(componentByTemplateWithinParentContainer) && typeof componentByTemplateWithinParentContainer === 'string') {
        return [componentByTemplateWithinParentContainer]
    }

    const grandParentOwnerRowId = currentViewElementsGraph.components[parentOwnerComponentId].parentRowId
    const grandParentComponentId = currentViewElementsGraph.rows.graph[grandParentOwnerRowId].parentComponentId
    const grandParentInstancesByTemplate =
        isNotEmpty(grandParentComponentId) && grandParentComponentId in childrenOfComponents
            ? childrenOfComponents[grandParentComponentId].childrenByTemplateId[depTemplateId]
            : null
    // Кейс 7: в качестве зависимости выбран container компонент (который плодится repeater-ом).
    if (grandParentInstancesByTemplate?.includes(parentOwnerComponentId)) {
        return [parentOwnerComponentId]
    }

    const componentsByTemplateWithinContainer = getInstancesWithinContainer({
        childrenOfComponents,
        containerId: parentOwnerComponentId,
        targetTemplateId: depTemplateId,
    })

    // Кейсы 8 и 9:
    // 8: в качестве зависимости выбран компонент внутри другого repeater компонента (не вложенного в текущий) - возвращаем все экземпляры шаблона в рамках всей формы.
    // 9: в качестве зависимости выбран компонент вложенный в соседний, по отношению к owner component, container/repeater - возвращаем все экземпляры данного templateId в рамках родителя компонента owner.
    return isNotEmpty(componentsByTemplateWithinContainer) ? componentsByTemplateWithinContainer : allComponentsDepTemplate
}
