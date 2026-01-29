- Условие на container (componentId) имеет зависимость componentId.

isNeighbour(compA, compB) {
    parentCompA = getParent(compA)
    return isUnnestedChildren(parentCompA, compB)
}

if (isTemplate(depId)) {
    parentComp = getParent(componentId)

    if (isContainer(componentId)) {
        if (isChildren(componentId, depId)) {
            if (isUnnestedChildren(componentId, depId)) {
                return один экземпляр depId
            }
            return все экземпляры depId в рамках componentId
        }
        return все экземпляры depId
    } else if (isNeighbour(componentId, depId)) {
        return один экземпляр depId
    } else if (parentComp === depId) {
        return один экземпляр depId (по сути это parentComp)
    }

    if (isEmpty(parentComp)) {
        return все экземпляры depId
    }

    if (isChildren(parentComp, depId)) {
        return все экземпляры depId в рамках parentComp
    }

    return все экземпляры depId
} else {
    return depId
}




// TODO ограничение контекста  для соседей - container/repeater компоненты.

// const $componentsNeightbors = combine(viewsService.$currentViewElementsGraph, (currentViewElementsGraph) => {
//     const result: Record<EntityId, {}>
//     currentViewElementsGraph.
//     нужно по idcontextparentid взять инфу про его детей непосредственных и узнать если ли там такой componentId
//     return {...какой интерфейс ожидается?}
// })

// узнать componentParentId - есть
// получить все экземпляры по teamplterId в рамках componentId - в buildViewElementsGraph кажется можно сделать. Объект {[componentContainerId]: Set<EntityId>} - но по teamplteId там не нужно определять, тут нужно, иначе потяем componenrtsService туда.
// если один - сосед. Если больше одного - не сосед а вложенные repeater

// TODO
// 1. РЕАЛИЗОВАТЬ DEEP COMPONENTS BY TEMPLATE ID

// НУЖНО при пробежке по views смотреть, явлеяется ли текущий comp шаблоном. Если да - пихаем в мапу отдельную под шаблоны. Если нет - ничего не делаем.

// 0. ctx.getParentComponentId: (componentId?: EntityId) => EntityId | null
// 0. ctx.getTemplateInstance: (templateId: EntityId, contextParentId?: EntityId) => EntityId[] | null
// 0. ctx.isNeightbor...
