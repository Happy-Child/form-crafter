import { buildFlattenGraphAndFindCycles } from '.'

describe('buildFlattenGraphAndFindCycles', () => {
    it('should be build correct flatten graph', () => {
        const graph = {
            a: new Set(['b', 'c', 'd']),
            b: new Set(['x', 'c']),
            c: new Set(['z', 'k', 'd']),
            k: new Set(['d']),
            t: new Set<string>(),
            o: new Set<string>(),
        }

        const result = buildFlattenGraphAndFindCycles(graph)

        expect(result).toEqual({
            flattenGraph: {
                a: new Set(['b', 'x', 'c', 'z', 'k', 'd']),
                b: new Set(['x', 'c', 'z', 'k', 'd']),
                c: new Set(['z', 'k', 'd']),
                k: new Set(['d']),
            },
            cycles: [],
            hasCycle: false,
        })
    })

    it('should give the same result with different key orders', () => {
        const result1 = buildFlattenGraphAndFindCycles({
            a: new Set(['b']),
            c: new Set(['b', 'a']),
            b: new Set<string>(),
        })
        const result2 = buildFlattenGraphAndFindCycles({
            c: new Set(['b', 'a']),
            b: new Set<string>(),
            a: new Set(['b']),
        })

        expect(result1).toEqual({
            flattenGraph: {
                a: new Set(['b']),
                c: new Set(['b', 'a']),
            },
            cycles: [],
            hasCycle: false,
        })
        expect(result2).toEqual({
            flattenGraph: {
                a: new Set(['b']),
                c: new Set(['b', 'a']),
            },
            cycles: [],
            hasCycle: false,
        })
    })

    it('should be found cycles', () => {
        const result1 = buildFlattenGraphAndFindCycles({
            a: new Set(['b', 'c', 'd']),
            b: new Set(['x', 'c']),
            c: new Set(['z', 'k', 'd']),
            k: new Set(['d']),
            d: new Set(['a']),
        })
        expect(result1).toEqual({
            flattenGraph: {
                a: new Set(['b', 'x', 'c', 'z', 'k', 'd', 'a']),
                b: new Set(['x', 'c', 'z', 'k', 'd', 'a']),
                c: new Set(['z', 'k', 'd', 'a']),
                k: new Set(['d', 'a']),
                d: new Set(['a']),
            },
            cycles: [['a', 'b', 'c', 'k', 'd', 'a']],
            hasCycle: true,
        })

        const result2 = buildFlattenGraphAndFindCycles({
            a: new Set(['a']),
        })
        expect(result2).toEqual({
            flattenGraph: {
                a: new Set(['a']),
            },
            cycles: [['a', 'a']],
            hasCycle: true,
        })
    })

    it('should be found cycles', () => {
        const graph = {
            a: new Set(['b', 'c', 'd']),
            b: new Set(['x', 'c']),
            c: new Set(['z', 'a', 'k', 'd']),
            k: new Set(['d']),
            d: new Set(['a']),
        }

        const result = buildFlattenGraphAndFindCycles(graph)

        expect(result).toEqual({
            flattenGraph: {
                a: new Set(['b', 'x', 'c', 'z', 'a', 'k', 'd']),
                b: new Set(['x', 'c', 'z', 'a', 'k', 'd']),
                c: new Set(['z', 'a', 'k', 'd']),
                k: new Set(['d', 'a']),
                d: new Set(['a']),
            },
            cycles: [
                ['a', 'b', 'c', 'a'],
                ['a', 'b', 'c', 'k', 'd', 'a'],
            ],
            hasCycle: true,
        })
    })

    it('should be return empty', () => {
        const emptyResult = {
            flattenGraph: {},
            cycles: [],
            hasCycle: false,
        }

        const result1 = buildFlattenGraphAndFindCycles({
            a: new Set(),
            b: new Set(),
            c: new Set(),
            k: new Set(),
            d: new Set(),
        })
        expect(result1).toEqual(emptyResult)

        const result2 = buildFlattenGraphAndFindCycles({})
        expect(result2).toEqual(emptyResult)
    })
})
