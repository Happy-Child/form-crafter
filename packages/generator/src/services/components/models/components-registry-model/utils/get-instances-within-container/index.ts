import { EntityId } from '@form-crafter/core'
import { isEmpty } from '@form-crafter/utils'

import { ChildrenOfComponents } from '../../types'

type Params = {
    childrenOfComponents: ChildrenOfComponents
    containerId: EntityId
    targetTemplateId: EntityId
}

export const getInstancesWithinContainer = ({ childrenOfComponents, containerId, targetTemplateId }: Params): EntityId[] => {
    const result: EntityId[] = []

    const dataOfChildren = childrenOfComponents[containerId]
    if (isEmpty(dataOfChildren)) {
        return result
    }

    const execute = (dataOfChildren: ChildrenOfComponents[keyof ChildrenOfComponents]) => {
        if (targetTemplateId in dataOfChildren.childrenByTemplateId) {
            if (dataOfChildren.type === 'repeater') {
                result.push(...dataOfChildren.childrenByTemplateId[targetTemplateId])
            } else {
                result.push(dataOfChildren.childrenByTemplateId[targetTemplateId])
            }
        }

        dataOfChildren.children.forEach((componentId) => {
            const dataOfChildren = childrenOfComponents[componentId]
            if (isEmpty(dataOfChildren)) {
                return
            }
            execute(dataOfChildren)
        })
    }

    execute(dataOfChildren)

    return result
}
