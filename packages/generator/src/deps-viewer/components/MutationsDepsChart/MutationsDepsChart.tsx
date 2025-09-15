import { FC, memo, useMemo } from 'react'

import { useUnit } from 'effector-react'
import { DataSet, Edge, Node } from 'vis-network/standalone'

import { useGeneratorContext } from '../../../contexts'
import { DepsChartBase } from '../DepsChartBase'

const MutationsDepsChartBase: FC = () => {
    const { services } = useGeneratorContext()

    const infoOfGraphMutationResolution = useUnit(services.componentsSchemasService.depsOfRulesModel.$infoOfGraphMutationResolution)

    const componentsInvolvedInMutations = useMemo(
        () => Array.from(new Set(Object.entries(infoOfGraphMutationResolution.graph).flatMap(([id, comps]) => [id, ...comps]))),
        [infoOfGraphMutationResolution.graph],
    )

    const nodes = useMemo(() => {
        const result = componentsInvolvedInMutations.map((id) => ({ id, label: id }))
        return new DataSet<Node>(result)
    }, [componentsInvolvedInMutations])

    const edges = useMemo(() => {
        const { graph, hasCycle, cycles } = infoOfGraphMutationResolution

        const result = Object.entries(graph).flatMap(([componentId, dependentComponents]) =>
            dependentComponents.map((depId) => {
                const color = hasCycle && cycles.some((cycle) => cycle.includes(componentId) && cycle.includes(depId)) ? { color: 'red' } : undefined

                return { from: componentId, to: depId, color }
            }),
        )

        return new DataSet<Edge>(result)
    }, [infoOfGraphMutationResolution])

    return <DepsChartBase nodes={nodes} edges={edges} />
}

export const MutationsDepsChart = memo(MutationsDepsChartBase)
