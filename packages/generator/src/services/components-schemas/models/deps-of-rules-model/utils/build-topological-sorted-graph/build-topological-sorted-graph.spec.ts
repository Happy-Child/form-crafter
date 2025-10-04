import { buildTopologicalSortedGraph } from '.'

describe('buildTopologicalSortedGraph', () => {
    it('should be build correct sorted graph', () => {
        const depsGraph = {
            a: new Set([]),
            b: new Set(['a']),
            c: new Set(['a', 'b']),
        }
        const flattenDependentsGraph = {
            a: new Set(['c', 'b']),
            b: new Set(['c']),
        }

        const result = buildTopologicalSortedGraph(flattenDependentsGraph, depsGraph)

        expect(result).toEqual({
            a: ['b', 'c'],
            b: ['c'],
        })
    })

    it('should be build correct sorted graph', () => {
        const depsGraph = {
            a: new Set([]),
            b: new Set(['a']),
            c: new Set(['b', 'a']),
            d: new Set(['c', 'b']),
            e: new Set(['d', 'a', 'c', 'b']),
        }

        const flattenDependentsGraph = {
            a: new Set(['b', 'c', 'd', 'e']),
            b: new Set(['c', 'd', 'e']),
            c: new Set(['d', 'e']),
            d: new Set(['e']),
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
            a: new Set(['z']),
            e: new Set(['c']),
            c: new Set(['a', 'g', 's', 'j']),
            g: new Set(['a', 'q']),
            z: new Set(['r']),
        }
        const flattenDependentsGraph = {
            z: new Set(['a', 'c', 'e', 'g']),
            c: new Set(['e']),
            a: new Set(['c', 'e', 'g']),
            g: new Set(['c', 'e']),
            s: new Set(['c', 'e']),
            j: new Set(['c', 'e']),
            q: new Set(['g', 'c', 'e']),
            r: new Set(['z', 'a', 'c', 'e', 'g']),
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
            c: new Set(['s', 'a', 'g', 'j']),
            a: new Set(['z']),
            e: new Set(['c']),
            g: new Set(['q', 'a']),
            z: new Set(['r']),
        }

        const flattenDependentsGraph = {
            q: new Set(['g', 'e', 'c']),
            j: new Set(['e', 'c']),
            g: new Set(['e', 'c']),
            z: new Set(['c', 'e', 'a', 'g']),
            c: new Set(['e']),
            r: new Set(['g', 'e', 'z', 'c', 'a']),
            a: new Set(['g', 'c', 'e']),
            s: new Set(['c', 'e']),
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
        const depsGraph = {
            a: new Set([]),
            b: new Set([]),
            c: new Set([]),
        }

        const flattenDependentsGraph = {
            a: new Set([]),
            b: new Set([]),
            c: new Set([]),
        }

        expect(buildTopologicalSortedGraph(flattenDependentsGraph, depsGraph)).toEqual({})
        expect(buildTopologicalSortedGraph({}, {})).toEqual({})
    })
})
