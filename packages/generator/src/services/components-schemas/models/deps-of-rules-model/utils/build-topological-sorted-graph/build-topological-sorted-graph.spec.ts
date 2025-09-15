import { buildTopologicalSortedGraph } from '.'

describe('buildTopologicalSortedGraph', () => {
    it('should be build correct sorted graph', () => {
        const depsGraph = {
            a: [],
            b: ['a'],
            c: ['a', 'b'],
        }
        const flattenDependentsGraph = {
            a: ['c', 'b'],
            b: ['c'],
        }

        const result = buildTopologicalSortedGraph(flattenDependentsGraph, depsGraph)

        expect(result).toEqual({
            a: ['b', 'c'],
            b: ['c'],
        })
    })

    it('should be build correct sorted graph', () => {
        const depsGraph = {
            a: [],
            b: ['a'],
            c: ['b', 'a'],
            d: ['c', 'b'],
            e: ['d', 'a', 'c', 'b'],
        }

        const flattenDependentsGraph = {
            a: ['b', 'c', 'd', 'e'],
            b: ['c', 'd', 'e'],
            c: ['d', 'e'],
            d: ['e'],
        }

        const result = buildTopologicalSortedGraph(flattenDependentsGraph, depsGraph)

        expect(result).toEqual({
            a: ['b', 'c', 'd', 'e'],
            b: ['c', 'd', 'e'],
            c: ['d', 'e'],
            d: ['e'],
        })
    })

    it('should be build correct sorted graph', () => {
        const depsGraph = {
            a: ['z'],
            e: ['c'],
            c: ['a', 'g', 's', 'j'],
            g: ['a', 'q'],
            z: ['r'],
        }
        const flattenDependentsGraph = {
            z: ['a', 'c', 'e', 'g'],
            c: ['e'],
            a: ['c', 'e', 'g'],
            g: ['c', 'e'],
            s: ['c', 'e'],
            j: ['c', 'e'],
            q: ['g', 'c', 'e'],
            r: ['z', 'a', 'c', 'e', 'g'],
        }

        const result = buildTopologicalSortedGraph(flattenDependentsGraph, depsGraph)

        expect(result).toEqual({
            z: ['a', 'g', 'c', 'e'],
            c: ['e'],
            a: ['g', 'c', 'e'],
            g: ['c', 'e'],
            s: ['c', 'e'],
            j: ['c', 'e'],
            q: ['g', 'c', 'e'],
            r: ['z', 'a', 'g', 'c', 'e'],
        })
    })

    it('should be build correct sorted graph with different deps orders', () => {
        const depsGraph = {
            c: ['s', 'a', 'g', 'j'],
            a: ['z'],
            e: ['c'],
            g: ['q', 'a'],
            z: ['r'],
        }

        const flattenDependentsGraph = {
            q: ['g', 'e', 'c'],
            j: ['e', 'c'],
            g: ['e', 'c'],
            z: ['c', 'e', 'a', 'g'],
            c: ['e'],
            r: ['g', 'e', 'z', 'c', 'a'],
            a: ['g', 'c', 'e'],
            s: ['c', 'e'],
        }

        const result = buildTopologicalSortedGraph(flattenDependentsGraph, depsGraph)

        expect(result).toEqual({
            z: ['a', 'g', 'c', 'e'],
            c: ['e'],
            a: ['g', 'c', 'e'],
            g: ['c', 'e'],
            s: ['c', 'e'],
            j: ['c', 'e'],
            q: ['g', 'c', 'e'],
            r: ['z', 'a', 'g', 'c', 'e'],
        })
    })

    it('should be build empty graph', () => {
        expect(
            buildTopologicalSortedGraph(
                { a: [], b: [], c: [] },
                {
                    a: [],
                    b: [],
                    c: [],
                },
            ),
        ).toEqual({})
        expect(buildTopologicalSortedGraph({}, {})).toEqual({})
    })
})
