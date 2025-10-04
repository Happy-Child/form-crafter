import { cloneDeep } from 'lodash-es'

import { DepsGraphAsSet } from '../../../../../../types'

export const mergeDeps = (depsA: DepsGraphAsSet, depsB: DepsGraphAsSet) => {
    const result = cloneDeep(depsA)

    Object.entries(depsB).forEach(([componentId, deps]) => {
        if (componentId in result) {
            result[componentId] = new Set([...result[componentId], ...deps])
        } else {
            result[componentId] = deps
        }
    })

    return result
}
