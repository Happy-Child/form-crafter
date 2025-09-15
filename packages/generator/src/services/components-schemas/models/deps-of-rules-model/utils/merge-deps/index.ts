import { cloneDeep } from 'lodash-es'

import { DepsGraph } from '../../../../../../types'

export const mergeDeps = (depsA: DepsGraph, depsB: DepsGraph) => {
    const result = cloneDeep(depsA)

    Object.entries(depsB).forEach(([componentId, deps]) => {
        if (componentId in result) {
            result[componentId] = Array.from(new Set([...result[componentId], ...deps]))
        } else {
            result[componentId] = deps
        }
    })

    return result
}
