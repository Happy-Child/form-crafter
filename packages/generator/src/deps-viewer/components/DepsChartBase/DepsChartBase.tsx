import { FC, memo, useEffect, useRef } from 'react'

import { DataSet, Edge, Network, Node, Options } from 'vis-network/standalone'

const options: Options = {
    width: '100%',
    height: '600px',
    layout: { hierarchical: false },
    edges: { arrows: 'to' },
    physics: {
        enabled: true,
        stabilization: {
            enabled: true,
            iterations: 200,
        },
        barnesHut: {
            gravitationalConstant: -8000,
            centralGravity: 0.3,
            springLength: 120,
            springConstant: 0.05,
            damping: 0.09,
        },
    },
}

type Props = {
    nodes: DataSet<Node>
    edges: DataSet<Edge>
}

export const DepsChartBase: FC<Props> = memo(({ nodes, edges }) => {
    const containerRef = useRef<HTMLDivElement | null>(null)
    // const depsViewerRef = useRef<Network | null>(null)

    useEffect(() => {
        if (!containerRef.current) {
            return
        }

        const network = new Network(containerRef.current, { nodes, edges }, options)

        return () => {
            network.destroy()
        }
    }, [nodes, edges])

    return (
        <>
            <div ref={containerRef} />
        </>
    )
})

DepsChartBase.displayName = 'DepsChartBase'
