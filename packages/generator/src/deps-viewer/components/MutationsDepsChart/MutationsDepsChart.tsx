import { FC, memo, useMemo } from 'react'

import { useUnit } from 'effector-react'
import { DataSet, Edge, Node } from 'vis-network/standalone'

import { useGeneratorContext } from '../../../contexts'
import { DepsChartBase } from '../DepsChartBase'

const MutationsDepsChartBase: FC = () => {
    const { services } = useGeneratorContext()

    const infoOfGraphMutationsResolution = useUnit(services.componentsSchemasService.depsOfRulesModel.$infoOfGraphMutationsResolution)

    const componentsInvolvedInMutations = useMemo(
        () => Array.from(new Set(Object.entries(infoOfGraphMutationsResolution.graph).flatMap(([id, comps]) => [id, ...comps]))),
        [infoOfGraphMutationsResolution.graph],
    )

    const nodes = useMemo(() => {
        const result = componentsInvolvedInMutations.map((id) => ({ id, label: id }))
        return new DataSet<Node>(result)
    }, [componentsInvolvedInMutations])

    const edges = useMemo(() => {
        const { graph, hasCycle, cycles } = infoOfGraphMutationsResolution

        const result = Object.entries(graph).flatMap(([componentId, dependentComponents]) =>
            Array.from(dependentComponents).map((depId) => {
                const color = hasCycle && cycles.some((cycle) => cycle.includes(componentId) && cycle.includes(depId)) ? { color: 'red' } : undefined
                return { from: componentId, to: depId, color }
            }),
        )

        return new DataSet<Edge>(result)
    }, [infoOfGraphMutationsResolution])

    return <DepsChartBase nodes={nodes} edges={edges} />
}

export const MutationsDepsChart = memo(MutationsDepsChartBase)
